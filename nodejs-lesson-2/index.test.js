const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const src = path.resolve(__dirname, 'src');
//const workers = []; // estead of this in .on('message')

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}


function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}...`);

    cluster.fork().on('message', function(message) {
      console.log(`Master ${process.pid} receives message '${JSON.stringify(message)}' from worker ${this.process.pid}`);
    });
  }

  for (const id in cluster.workers) {
    const worker = cluster.workers[id];
    console.log(`Master ${process.pid} sends message to worker ${worker.process.pid}...`);
    worker.send({ msg: `Message from master ${process.pid}` });
  }
}

function childProcess() {
  console.log(`Worker ${process.pid} started`);

  process.on('message', function(message) {
    console.log(`Worker ${process.pid} received message '${JSON.stringify(message)}'`);
  });

  console.log(`Worker ${process.pid} sends message to master...`);
  process.send({ msg: `Message from worker ${process.pid}` });

  console.log(`Worker ${process.pid} finished`)
}


/*

const cache = [];
function runTests(path) {
  fs.readdir(src, {withFileTypes: true}, (err, dirents) => {
    if (err)
      throw err;

    dirents.forEach(dirent => {
      if (dirent.isDirectory()) {
        cache.push(dirent);
      } else if (dirent.isFile() || dirent.isSymbolicLink()) {

      }
    })

  });


}
*/




