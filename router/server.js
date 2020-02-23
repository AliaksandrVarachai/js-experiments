const http = require('http');
const fs = require('fs');
const util = require('util');
const path = require('path');

const pReadFile = util.promisify(fs.readFile);
const pReadDir = util.promisify(fs.readdir);

// returns map with read files
const getFileMap = pReadDir(__dirname)
  .then(filenames => {
    const fileMap = filenames.reduce((acc, fname) => {
      acc[fname] = pReadFile(path.join(__dirname, fname));
      return acc;
    }, {});

    return Promise.all(Object.values(fileMap))
      .then(_ => fileMap);
  });




// const pFiles = fs.readdir(__dirname, (error, filenames) => {
//   if (error) {
//     console.error(error.message);
//     return;
//   }
//   const fileMap = filenames.reduce((acc, fname) => {
//     acc[fname] = pReadFile(path.join(__dirname, fname));
//     return acc;
//   }, {});
//
//   return Promise.all(Object.values(fileMap))
//     .then(_ => fileMap);
// });

const server = http.createServer((req, res) => {
  const { url, method } = req;
  getFileMap
    .then(fileMap => {
      if ((/^(\/|\/index|\/index\.html)$/i).test(url)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fileMap['index.html'].then(content => res.end(content));
      } else if ((/^\/page-\d+$/i).test(url.toLowerCase())) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          fileMap['index.html'].then(content => res.end(content));
      } else if ((/\.js$/i).test(url)) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        fileMap[url.substring(1)].then(content => res.end(content));
      } else if ((/\.css$/i).test(url)) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        fileMap[url.substring(1)].then(content => res.end(content));
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
      }
    })
    .catch(fileError => {
      throw fileError;
      // console.error(fileError.message);
    });
});


server.listen(9080, () => {
  console.log('Server is listening on localhost:9080')
});