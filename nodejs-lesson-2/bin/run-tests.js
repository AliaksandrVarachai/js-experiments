#!/usr/bin/env node

// run-test.js [path-to-dir-or-file-1 path-to-dir-or-file-2...]

const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '..');
const src = path.resolve(rootPath, '../src');

/**
 * Mask to search test files.
 * @constant {RegExp} fileTestMask
 */
const testFilenameMask = /[-.]test[-.]m?js$/i;

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
  /^\//.test(testFilePath) ? testFilePath : path.resolve(rootPath, testFilePath)
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
  let isErrorThrown = false; // flag to stop all async processes
  let asyncCallbackCounter = 0;

  function setErrorFlagAndCallCallback(err) {
    isErrorThrown = true;
    callback(err);
  }

  function logFoundFile(filePath) {
    console.log(`found: ${filePath}`);
  }

  (function recursiveReaddir(dirPath, cb) {
    asyncCallbackCounter++; // for fs.readdir

    fs.readdir(dirPath, (err, filenames) => {
      if (isErrorThrown)
        return;
      if (err)
        return setErrorFlagAndCallCallback(Error(`Directory "${dirPath}" is not found or access to it is denied.`));

      filenames.forEach(filename => {
        const absoluteFilePath = path.resolve(dirPath, filename);
        asyncCallbackCounter++; // for fs.stat

        fs.stat(absoluteFilePath, (err, stats) => {
          if (isErrorThrown)
            return;
          if (err)
            return setErrorFlagAndCallCallback(Error(`File "${absoluteFilePath}" is not found or access to it is denied.`));

          if (stats.isDirectory()) {
            recursiveReaddir(absoluteFilePath, cb);
          } else if (stats.isFile() && testFilenameMask.test(absoluteFilePath)) {
            foundTestFiles.push(absoluteFilePath);
            cb(absoluteFilePath);
          } else {
            // ignore other files, symlinks are regarded as files which they point to
          }

          asyncCallbackCounter--;
          if (asyncCallbackCounter === 0) {
            callback(null, foundTestFiles);
          }
        });
      });

      asyncCallbackCounter--;
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
        console.log('list of loaded files: ', testFiles);
        testFiles.forEach(testFile => require(testFile));
      });
    } else if (stats.isFile()) {
      require(testFilePath);
    } else {
      throw Error(`"${testFilePath}" does not match file or directory.`);
    }
  });
});
