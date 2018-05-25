const http = require('http');
const fs = require('fs');
const path = require('path');

const staticDir = path.resolve(__dirname, '../static');

const server = http.createServer();

server.on('request', (req, res) => {
  const { method, url, headers } = req;
  console.log('URL: ' + url);
  console.log('method: ' + method);

  req.on('error', err => {
    console.log('captured error: ', err.stack);
  });

  if (method === 'GET') {
    res.setHeader('Content-Type', 'text/plain');
    if (url === '/' || '/index' || '/index.html') {
      const pathname = path.resolve(staticDir, 'index.html');
      fs.exists(pathname, exists => {
        if (!exists) {
          res.statusCode = 404;
          res.end(`File ${pathname} is not found`);
          return;
        }
        fs.readFile(path.resolve(staticDir, 'index.html'), (err, data) => {
          res.setHeader('Content-Type', 'text/html');
          res.write(data);
          res.end();
        });
      });
    } else {
      res.whiteHead(400, {'Content-Type': 'text/html'});
      res.end('no data');
    }
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



