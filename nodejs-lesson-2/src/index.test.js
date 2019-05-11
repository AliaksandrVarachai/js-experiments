const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const src = path.resolve(__dirname, 'src');
//const workers = []; // estead of this in .on('message')

/**
 * Mask to search test files.
 * @constant {RegExp} fileTestMask
 */
const testFilenameMask = /\.test\.m?js$/i;

/**
 * Default name of a test file.
 * @constant {string}
 */
const defaultTestFilename = 'index.test.js';

/**
 * Default path to a default test file.
 * @type {string}
 */
const defaultTestFilepath = path.resolve(src, defaultTestFilename);

/**
 * Contains all found found in argv paths to test files otherwise uses default path.
 * @type {string[]} [[defaultTestFilepath]]
 */
let testFilePaths = process.argv.slice(2).map(testFilePath =>
  /^\//.test(testFilePath) ? testFilePath : path.resolve(__dirname, testFilePath)
);
if (testFilePaths.length < 1)
  testFilePaths = [defaultTestFilepath];


/**
 * Callback provides array of file paths found by DFS.
 *
 * @callback testFilesCallback
 * @param err {Error} - Error when file is not found or access is denied.
 * @param fileList {string[]} - list of file paths.
 */

/**
 * Provides an array with found files for the given root.
 *
 * @param rootDirPath {string} - directory to start search of test files.
 * @param callback {testFilesCallback} - callback must be called when all test files are found.
 */
function getTestFiles(rootDirPath, callback) {
  const foundTestFiles = [];
  let totalFiles = 1;        // total number of files & dirs
  let traversedFiles = 0;    // number of called callbacks for files & dir
  let isErrorThrown = false; // flag to stop async processes

  function setErrorFlagAndCallCallback(err) {
    isErrorThrown = true;
    callback(err);
  }

  function logFoundFile(filePath) {
    console.log(`#${traversedFiles}: ${filePath}`);
  }

  (function recursiveReaddir(dirPath, cb) {
    fs.readdir(dirPath, (err, files) => {
      if (isErrorThrown)
        return;
      if (err)
        return setErrorFlagAndCallCallback(Error(`Directory "${dirPath}" is not found or access to it is denied.`));

      totalFiles += files.length;

      files.forEach(filePath => {
        fs.stat(filePath, (err, stats) => {
          if (isErrorThrown)
            return;
          if (err)
            return setErrorFlagAndCallCallback(Error(`File "${filePath}" is not found or access to it is denied.`));

          traversedFiles++;
          if (stats.isDirectory()) {
            recursiveReaddir(filePath, cb);
          } else if (stats.isFile() && testFilenameMask.test(filePath)) {
            foundTestFiles.push(filePath);
            cb(filePath);
          } else {
            // ignore other files, symlinks are regarded as files which they point to
          }
          if (traversedFiles === totalFiles) {
            callback(null, foundTestFiles);
          }
        });
      })
    });
  }) (rootDirPath, logFoundFile);
}

/**
 * Goes though passed in argv file paths and call all found tests.
 */
testFilePaths.forEach(testFilePath => {
  fs.stat(testFilePath, (err, stats) => {
    if (err)
      throw err;
    if (stats.isDirectory()) {
      getTestFiles(testFilePath, (err, testFiles) => {
        if (err)
          throw err;
        testFiles.forEach(testFile => require(testFile));
      });
    } else if (stats.isFile()) {
      require(testFilePath);
    } else {
      throw Error(`"${testFilePath}" does not match file or directory.`);
    }
  });
});

//
// if (cluster.isMaster) {
//   masterProcess();
// } else {
//   childProcess();
// }
//
//
// function masterProcess() {
//   console.log(`Master ${process.pid} is running`);
//
//
//
//   for (let i = 0; i < numCPUs; i++) {
//     console.log(`Forking process number ${i}...`);
//
//     cluster.fork().on('message', function(message) {
//       console.log(`Master ${process.pid} receives message '${JSON.stringify(message)}' from worker ${this.process.pid}`);
//     });
//   }
//
//   for (const id in cluster.workers) {
//     const worker = cluster.workers[id];
//     console.log(`Master ${process.pid} sends message to worker ${worker.process.pid}...`);
//     worker.send({ msg: `Message from master ${process.pid}` });
//   }
// }
//
// function childProcess() {
//   console.log(`Worker ${process.pid} started`);
//
//   process.on('message', function(message) {
//     console.log(`Worker ${process.pid} received message '${JSON.stringify(message)}'`);
//   });
//
//   console.log(`Worker ${process.pid} sends message to master...`);
//   process.send({ msg: `Message from worker ${process.pid}` });
//
//   console.log(`Worker ${process.pid} finished`)
// }


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




