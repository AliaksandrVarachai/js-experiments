class Shooter {}

class NShooter extends Shooter {
  constructor(speed) {
    super();
    this.speed = speed;
  }
}

class SShooter extends Shooter {}

class Zombie {
  constructor(health) {
    this.health = health;
  }
  decreaseHealth(damage) { this.health -= damage; }
  isKilled() { return this.health < 1; }
}

function plantsAndZombies(origLawn, origZombies) {
  const lawn = [];
  const lawnWidth = origLawn[0].length;
  const lawnHeight = origLawn.length

  const nShooters = [];  // {i, j, shooter}
  const sShooters = [];  // {i, j, shooter}
  for (let i = 0; i < lawnHeight; ++i) {
    lawn.push([]);
    for (let j = 0; j < lawnWidth; ++j) {
      const c = origLawn[i][j];
      if (c === ' ') {
        lawn[i][j] = null;
        continue;
      }
      let shooter, len;
      if (c === 'S') {
        shooter = new SShooter();
        len = sShooters.push({ shooter, i, j});
      } else if (c !== ' ') {
        shooter = new NShooter(Number.parseInt(c, 10));
        len = nShooters.push({ shooter, i, j });
        lawn[i][j] = { shooter, inx: len - 1 };
      }
    }
  }
  sShooters.sort((s1, s2) => s1.j !== s2.j ? s2.j - s1.j : s2.i - s1.i);
  sShooters.forEach(({ shooter, i, j }, inx) => {
    lawn[i][j] = { shooter, inx };
  })

  printLawn()

  const zombies = [];
  const futureZombies = origZombies.slice();

  function generateZombies(moveNumber) {
    let i = 0;
    while (i < futureZombies.length) {
      const [generateMoveNumber, row, health] = futureZombies[i];
      if (generateMoveNumber === moveNumber) {
        const zombie = new Zombie(health);
        const len = zombies.push({ zombie, i: row, j: lawnWidth - 1 });
        lawn[row][lawnWidth - 1] = { zombie, inx: len - 1 };
        futureZombies.splice(i, 1);
      } else {
        ++i;
      }
    }
  }

  function printLawn(label) {
    console.log('-----------' + label);
    lawn.forEach(row => {
      let line = ''
      row.forEach(item => {
        if (item === null) line += '+';
        else if (item.zombie) line += item.zombie.health;
        else if (item.shooter instanceof NShooter) line += item.shooter.speed;
        else line += 'S';
      });
      console.log(line);
    });
    console.log('-----------');
  }

  for (let moveNumber = 0; true; ++moveNumber) {
    printLawn(moveNumber);
    moveZombies();
    generateZombies(moveNumber);
    if (areZombiesWon()) return moveNumber + 1;
    volley();
    if (zombies.length < 1 && futureZombies.length < 1) return null;
  }


  function shoot(shooter, shooterI, shooterJ) {
    for (let j = shooterJ + 1; j < lawnWidth; ++j) {
      const zombie = lawn[shooterI][j] && lawn[shooterI][j].zombie;
      if (zombie) {
        // zombie.decreaseHealth(shooter instanceof NShooter ? shooter.speed : 1);
        zombie.decreaseHealth(1);
        break;
      }
    }
    if (shooter instanceof SShooter) {
      for (let i = shooterI + 1, j = shooterJ + 1; i < lawnHeight && j < lawnWidth; ++i, ++j) {
        const zombie = lawn[i][j] && lawn[i][j].zombie;
        if (zombie) {
          zombie.decreaseHealth(1);
          break;
        }
      }
      for (let i = shooterI - 1, j = shooterJ + 1; i >= 0 && j < lawnWidth; --i, ++j) {
        const zombie = lawn[i][j] && lawn[i][j].zombie;
        if (zombie) {
          zombie.decreaseHealth(1);
          break;
        }
      }
    }
  }

  function volley() {
    nShooters.forEach(({ shooter, i, j }) => {
      for (let shootInx = 0; shootInx < shooter.speed; ++shootInx) {
        shoot(shooter, i, j);
        clearKilledZombies();
      }
    });

    sShooters.forEach(({ shooter, i, j }) => {
      shoot(shooter, i, j);
      clearKilledZombies();
    });
  }

  function moveZombies() {
    zombies.forEach(indexedZombie => {
      const { zombie, i, j } = indexedZombie;
      const nextLawn = lawn[i][j - 1];
      if (nextLawn && nextLawn.shooter) {
        const { shooter, inx } = nextLawn;
        if (shooter) {
          console.log('zombie', zombie, i, j, 'killed shooter', shooter, i, j - 1)
          killEntity(shooter, inx)
        }
      }
      lawn[i][j - 1] = lawn[i][j];
      lawn[i][j] = null;
      --indexedZombie.j;
    })
  }

  function killEntity(entity, inx) {
    let entities, entityName;
    if (entity instanceof Zombie) {
      entities = zombies;
      entityName = 'zombie'
    } else if (entity instanceof NShooter) {
      entities = nShooters;
      entityName = 'shooter'
    } else if (entity instanceof SShooter ) {
      entities = sShooters;
      entityName = 'shooter'
    } else {
      throw Error('Unknown entity');
    }
    console.log(inx, entities[inx])
    const { i, j } = entities[inx];

    lawn[i][j] = null;
    entities.splice(inx, 1);
    for (let k = entities.length - 1; k >= inx; --k) {
      const { i, j } = entities[k];
      lawn[i][j].inx -= 1;
    }
  }

  function clearKilledZombies() {
    let zombieInx = 0;
    while (zombieInx < zombies.length) {
      const { zombie } = zombies[zombieInx];
      if (zombie.isKilled()) {
        killEntity(zombie, zombieInx);
      } else {
        ++zombieInx;
      }
    }
  }

  function areZombiesWon() {
    for (let zombieInx = zombies.length - 1; zombieInx >= 0; --zombieInx) {
      if (zombies[zombieInx].j === 0) return true;
    }
    return false;
  }
}

// const origLawn = [
//     '12      ',
//     '2S      ',
//     '1S      ',
//     '2S      ',
//     '3       '
// ];
// const origZombies = [[0,0,15],[1,1,18],[2,2,14],[3,3,15],[4,4,13],[5,0,12],[6,1,19],[7,2,11],[8,3,17],[9,4,18],[10,0,15],[11,4,14]];

const origLawn = [
  '11      ',
  ' 2S     ',
  '11S     ',
  '3       ',
  '13      '
];
const origZombies = [[0,3,16],[2,2,15],[2,1,16],[4,4,30],[4,2,12],[5,0,14],[7,3,16],[7,0,13]];

console.log(plantsAndZombies(origLawn, origZombies))
