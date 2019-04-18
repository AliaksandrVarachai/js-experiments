const fs = require('fs');
const util = require('util');

let prevFoundFiles = null;

// TODO: add the recursion
function getDirStat(path, cb) {
  fs.readdir(path, (err, files) => {
    if (err)
      return cb(Error('Cannot read files from the given directory.'));

    const dirStat = {};
    files.forEach((fileName, inx) => {
      fs.lstat(fileName, (err, stats) => {
        if (err)
          return cb(Error(err));

        dirStat[fileName] = {
          ctimeMs: stats.mtimeMs,
          mtimeMs: stats.mtimeMs,
          size: stats.size, // for any case
        };
        if (inx === files.length - 1) {
          cb(null, dirStat);
        }
      });
    });
  });
}

function compareDirs(dirStat1, dirStat2) {

  function compare(stat1, stat2) {
    // TODO: deep comparison of stats
  }

}

getDirStat('.', (err, dirStat) => {
  if (err)
    console.log(err.message);

  console.log(dirStat);

});


