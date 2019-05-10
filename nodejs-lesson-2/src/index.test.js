const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const src = path.resolve(__dirname, 'src');
//const workers = []; // estead of this in .on('message')

let testFilePaths = process.argv.slice(2).map(testFilePath =>
  /^\//.test(testFilePath) ? testFilePath : path.resolve(__dirname, testFilePath)
);
if (testFilePaths.length < 1)
  testFilePaths = [path.resolve(src, 'index.test.js')];

// cb(err, files)
/**
 * Provides an array with found files for the given root
 * @param rootDirPath {string} - directory to start seach of test files.
 * @param fileTestMask {regexp} - regexp to check test filename.
 * @param callback {function(err, cb)} - callback must be called when all test files are found.
 */
function getTestFiles(rootDirPath, fileTestMask, callback) {
  const foundTestFiles = [];

  // TODO: add err
  function addTestFile(filePath) {
    foundTestFiles.push(filePath);
  }

  (function recursiveReaddir(dirPath, cb) {
    fs.readdir(dirPath, (err, files) => {
      if (err)
        return cb(Error(`Directory "${dirPath}" is not found.`));
      files.forEach(filePath => {
        fs.stat(filePath, (err, stats) => {
          if (err)
            return cb(Error(`Access to file "${filePath}" is denied.`));
          // symlinks are regarded as files which they point to
          if (stats.isDirectory())
            return recursiveReaddir(filePath, cb);
          if (stats.isFile() && fileTestMask.test(filePath)) {
            foundTestFiles.push(filePath);
            cb(null, foundTestFiles)
          }
          // ignore other files
        });
      })
    });
  }) (rootDirPath, addTestFile);
}


const testFiles = [];

// gets all files from argv, search files in directories (if any) and put all files to testFiles[]
testFilePaths.forEach(testFilePath => {
  fs.stat(testFilePath, (err, stats) => {
    if (err)
      return console.error(`File or directory "${testFilePath}" is not found.`);

    if (stats.isDirectory()) {
      getTestFiles(testFilePath, /\.test\.m?js$/i, (err, foundTestFiles) => {
        if (err)
          throw err;
        testFiles

      });
    } else if (stats.isFile()) {
      require(testFilePath);
    } else {
      throw Error(`"${testFilePath}" does not match file or directory.`);
    }
  });
});


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




