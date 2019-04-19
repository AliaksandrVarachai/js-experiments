const path = require('path');
const fs = require('fs');
// const util = require('util');
const { promisify } = require('util');

let prevFoundFiles = null;

function getFilenameFromPath(filePath) {
  return path.basename(filePath, '.csv');
}

/**
 *
 * @param csvLines (Array)
 */
function csvToJson(csvLines) {
  const fieldNames = [];
  let isQuotationMarkOpened = false;
  let ignoreNextChar = false;
  let startPos = 0;

  csvLines[0].forEach((c, i) => {
    if (ignoreNextChar)
      return ignoreNextChar = false;

    if (c === '\\')
      return ignoreNextChar = true;

    if (c === '"') {
      if (isQuotationMarkOpened) {
        fieldNames.push(csvLines[0].substring(startPos, i));
      } else {
        startPos = i + 1;
      }
      isQuotationMarkOpened = !isQuotationMarkOpened;
    }

    if ((c === ' ' || c === ',') && !isQuotationMarkOpened) {
      if (startPos === i)
        return startPos = i + 1;
      fieldNames.push(csvLines[0].substring(startPos, i));
      startPos = i + 1;
    }
  });



  return fieldNames;
}

// TODO: add the recursion
function getDirStat(path, cb) {
  fs.readdir(path, {withFileTypes: true}, (err, dirents) => {
    if (err)
      return cb(Error('Cannot read files from the given directory.'));

    const linkToPrevObj = {};
    const foundFiles = dirents.map((dirent, inx) => {
      if (dirent.isDirectory()) {
        const newDirPath = path.resolve(path, dirent.name);
        return linkToPrevObj[getFilenameFromPath(newDirPath)] = []
        getDirStat(path.resolve(path, dirent.name), cb111);
      } else if (dirent.isFile() || dirent.isSymbolicLink()) {

      } else {
        // other types are not supported
      }
    });




    //console.log(files);

    // const dirStat = {};
    //
    // files.forEach((fileName, inx) => {
    //   fs.lstat(fileName, (err,
    // stats) => {
    //     if (err)
    //       return cb(Error(err));
    //
    //     dirStat[fileName] = {
    //       ctimeMs: stats.mtimeMs,
    //       mtimeMs: stats.mtimeMs,
    //       size: stats.size, // for any case
    //     };
    //     if (inx === files.length - 1) {
    //       cb(null, dirStat);
    //     }
    //   });
    // });
  });
}

/*
   name: 'test.js',
   type: file/dir/link,
   ctimeMs: 123
   mtimeMs: 456
   size: (for any case)
   // if dir
   children: []
*/

// find unequal diff

/*

function compareDirs(dirStat1, dirStat2) {

  const cache = [];

  function compare(oldStat, newStat) {

    if (oldStat)
    const oldChildren = oldStat.children;
    // TODO: deep comparison of stats
  }

}*/

getDirStat('.', (err, dirStat) => {
  if (err)
    console.log(err.message);

  console.log(dirStat);

});


