#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkSymlink(path, cb) {
  fs.lstat(path, (err, stats) => {
    if (err) {
      console.log(err.message);
      return cb(err);
    }

    cb(null, {
      isSymbolicLink: stats.isSymbolicLink(),
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    });
  })
}

function logInfo(path) {
  return function(err, stats) {
    if (err)
      throw err;
    console.log(`path: ${path}`);
    for (const key of Object.keys(stats)) {
      console.log(`${key}: ${stats[key]}`);
    }
    console.log('*********************');
  }
}

const paths = [
  path.resolve(__dirname, '../src/1.js'),
  path.resolve(__dirname, '../src/link-1'),
  path.resolve(__dirname, '../bin'),
  path.resolve(__dirname, '../src/link-bin')
];
paths.forEach(path => {
  checkSymlink(path, logInfo(path));
});
