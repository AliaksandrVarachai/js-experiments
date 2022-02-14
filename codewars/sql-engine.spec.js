const chai = require('chai');
// const { describe, it } = require('mocha');
const SQLEngine = require('./sql-engine');
const db1 = require('./sql-engine-random-db');

chai.config.truncateThreshold = 0;

const { assert } = chai;

const movieDatabase = {
  movie: [
    { id: 1, name: 'Avatar', directorID: 1 },
    { id: 2, name: 'Titanic', directorID: 1 },
    { id: 3, name: 'Infamous', directorID: 2 },
    { id: 4, name: 'Skyfall', directorID: 3 },
    { id: 5, name: 'Aliens', directorID: 1 }
  ],
  actor: [
    { id: 1, name: 'Leonardo DiCaprio' },
    { id: 2, name: 'Sigourney Weaver' },
    { id: 3, name: 'Daniel Craig' },
  ],
  director: [
    { id: 1, name: 'James Cameron' },
    { id: 2, name: 'Douglas McGrath' },
    { id: 3, name: 'Sam Mendes' }
  ],
  actor_to_movie: [
    { movieID: 1, actorID: 2 },
    { movieID: 2, actorID: 1 },
    { movieID: 3, actorID: 2 },
    { movieID: 3, actorID: 3 },
    { movieID: 4, actorID: 3 },
    { movieID: 5, actorID: 2 },
  ]
};

describe('execution',function(){
  const engine = new SQLEngine(movieDatabase);

  it('should SELECT columns', function(){
    const actual = engine.execute('SELECT movie.name FROM movie');
    assertSimilarRows(actual, [{'movie.name':'Avatar'},
      {'movie.name':'Titanic'},
      {'movie.name':'Infamous'},
      {'movie.name':'Skyfall'},
      {'movie.name':'Aliens'}]);
  });

  it('should apply WHERE', function(){
    const actual = engine.execute('SELECT movie.name FROM movie WHERE movie.directorID = 1');
    assertSimilarRows(actual, [{'movie.name':'Avatar'},
      {'movie.name':'Titanic'},
      {'movie.name':'Aliens'}]);
  });

  it('should perform parent->child JOIN', function(){
    const actual = engine.execute('SELECT movie.name, director.name '
      +'FROM movie '
      +'JOIN director ON director.id = movie.directorID');
    assertSimilarRows(actual, [{'movie.name':'Avatar','director.name':'James Cameron'},
      {'movie.name':'Titanic','director.name':'James Cameron'},
      {'movie.name':'Aliens','director.name':'James Cameron'},
      {'movie.name':'Infamous','director.name':'Douglas McGrath'},
      {'movie.name':'Skyfall','director.name':'Sam Mendes'}]);
  });

  it('should perform child->parent JOIN ', function(){
    const actual = engine.execute('SELECT movie.name, director.name '
      +'FROM director '
      +'JOIN movie ON director.id = movie.directorID');
    assertSimilarRows(actual, [{'movie.name':'Avatar','director.name':'James Cameron'},
      {'movie.name':'Titanic','director.name':'James Cameron'},
      {'movie.name':'Infamous','director.name':'Douglas McGrath'},
      {'movie.name':'Skyfall','director.name':'Sam Mendes'},
      {'movie.name':'Aliens','director.name':'James Cameron'}]);
  });

  it('should perform many-to-many JOIN and apply WHERE', function(){
    const actual = engine.execute('SELECT movie.name, actor.name '
      +'FROM movie '
      +'JOIN actor_to_movie ON actor_to_movie.movieID = movie.id '
      +'JOIN actor ON actor_to_movie.actorID = actor.id '
      +'WHERE actor.name <> \'Daniel Craig\'');
    assertSimilarRows(actual, [{'movie.name':'Aliens','actor.name':'Sigourney Weaver'},
      {'movie.name':'Avatar','actor.name':'Sigourney Weaver'},
      {'movie.name':'Infamous','actor.name':'Sigourney Weaver'},
      {'movie.name':'Titanic','actor.name':'Leonardo DiCaprio'}]);
  });

  const randomEngine = new SQLEngine(db1);
  this.timeout(12000);
  it('Random tests', () => {
    const randomQueries = [
      "select director.name, actor.id FROM movie join director ON director.id = movie.directorID JOIN actor_to_movie ON actor_to_movie.movieID = movie.id join actor on actor.id = actor_to_movie.actorID where movie.year < 2002",
      "SELECT movie.title, movie.directorID FROM movie WHERE movie.year = 1995",
      "SELECT actor.id, movie.title FROM director JOIN movie on movie.directorID = director.id join actor_to_movie on actor_to_movie.movieID = movie.id JOIN actor on actor.id = actor_to_movie.actorID",
      "SELECT director.id, director.name FROM director JOIN movie on movie.directorID = director.id join actor_to_movie ON actor_to_movie.movieID = movie.id",
      "select movie.directorID, movie.title, movie.id FROM movie where movie.year = 2003",
      "SELECT actor.id from actor",
      "select director.name from movie join director ON director.id = movie.directorID JOIN actor_to_movie ON actor_to_movie.movieID = movie.id where movie.year = 1993",
      "SELECT movie.directorID from actor join actor_to_movie on actor_to_movie.actorID = actor.id JOIN movie on movie.id = actor_to_movie.movieID WHERE actor.name = 'Don Cheadle'",
      "SELECT director.id, director.name, movie.directorID from director join movie on movie.directorID = director.id join actor_to_movie ON actor_to_movie.movieID = movie.id JOIN actor ON actor.id = actor_to_movie.actorID",
      "SELECT movie.id FROM director join movie on movie.directorID = director.id JOIN actor_to_movie ON actor_to_movie.movieID = movie.id JOIN actor on actor.id = actor_to_movie.actorID where director.name = 'Jon Favreau'",
    ];
    const start = Date.now();
    randomQueries.forEach((query, inx) => {
      console.log(`Test #${inx} is completed in ${Date.now() - start} ms`)
      const actual = randomEngine.execute(query);
      // console.log(actual)
    });
  });
});

function assertSimilarRows(actual, expected, message){
  function logFailed(m, rows){
    console.log(m +'\n' + rows.map(JSON.stringify).join(',\n') + '\n');
  }
  if(!actual || actual.length === 0 || !expected || expected.length === 0){
    return assert.deepStrictEqual(actual, expected, message);
  }
  function allPropertiesInLeftInRight(a,b){
    return Object.keys(a).every(function(ak){ return a[ak] === b[ak]; })
  }
  function similarObjects(a,b){
    return allPropertiesInLeftInRight(a,b) && allPropertiesInLeftInRight(b,a);
  }
  function getRowsInLeftWhichAreNotInRight(left, right){
    return left.filter(function(r){
      return !right.some(function(a){ return similarObjects(a,r); });
    });
  }
  const missingRowsInActual = getRowsInLeftWhichAreNotInRight(expected, actual),
    extraRowsInActual = getRowsInLeftWhichAreNotInRight(actual, expected);
  if(missingRowsInActual.length > 0){
    logFailed('Failure: expected result to include the following rows, but they were missing: ', missingRowsInActual);
    return;
  }
  if(extraRowsInActual.length > 0){
    logFailed('Failure: result contained the following rows which were not expected: ', extraRowsInActual);
    return;
  }

  console.log(message);
}
