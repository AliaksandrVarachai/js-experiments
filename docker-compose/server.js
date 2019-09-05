const http = require('http');
const util = require('util');
const MongoClient = require('mongodb').MongoClient;

// const serverDBUrl = 'mongodb://localhost:27017';
const serverDBUrl = 'mongodb://db:27017';
const dbName = 'tableau-extension-guided-tour';
const collectionName = 'tours';

const port = 3000;



util.promisify(MongoClient.connect)(serverDBUrl)
  .then(mongoClient => {
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);

    const server = http.createServer((req, res) => {
      const { headers, method, url } = req;

      collection.findOne({ id: '123-456' })
        .then(tour => {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify(tour));
        })
        .catch(err => {
          console.error(err.message);
          res.writeHead(404, 'Tour is not found');
          res.end();
        });

    });

    server.listen(port, () => {
      console.log(`Server is listening on localhost:${port}.`);
    });

    server.on('close', () => {
      mongoClient.close();
      console.log(`Server https://localhost:${port} is stopped.`);
    });
  })
  .catch(err => console.error(err));
