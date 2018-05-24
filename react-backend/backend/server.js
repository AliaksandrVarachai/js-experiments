const http = require('http');

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
    res.end('ok');
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



