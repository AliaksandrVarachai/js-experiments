const http = require('node:http');

const port = 8000;
const data = [
  { name: 'banana' },
  { name: 'pineapple' },
  { name: 'orange' },
  { name: 'pair' },
];

const server = http.createServer();

server.on('request', (req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ data }));
});

server.listen(port, () => { console.log(`server is started on http://localhost:${port}`) });