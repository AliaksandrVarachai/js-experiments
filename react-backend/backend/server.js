const http = require('http');
const fs = require('fs');
const path = require('path');

const staticDir = path.resolve(__dirname, '../static');

const contentTypes = {
  text: 'text/plain',
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpg',
  ico: 'image/x-icon',
};

const server = http.createServer();

server.on('request', (req, res) => {
  const { method, url, headers } = req;
  req.on('error', err => {
    console.log('captured error: ', err.stack);
  });

  if (method === 'GET') {
    const rawExt = url.match(/\.([^\.]*)$/);
    const ext = rawExt && rawExt[1] ? rawExt[1] : 'html';
    const fileNotFoundPath = path.resolve(staticDir, '404.html');
    const filePath = url === '/' || url === '/index' || url === '/index.html'
      ? path.resolve(staticDir, 'index.html')
      : path.resolve(staticDir, url.slice(url.indexOf('/') + 1));

    fs.exists(filePath, exists => {
      if (!exists) {
        fs.readFile(fileNotFoundPath, (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end(`Sorry, check with the site admin error ${err.code} (${err.info})`);
            return;
          }
          res.writeHead(200, {'Content-Type': contentTypes[ext]});
          res.end(content, 'utf-8');
        });
        return;
      }
      fs.readFile(filePath, (err, content) => {
        if (err)
          throw err;
        res.writeHeader(200, {'Content-Type': contentTypes[ext]});
        res.end(content, 'utf-8');
      });
    });
  }

  if (method === 'POST') {
    let body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body: ', body);
      });
  }
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});



