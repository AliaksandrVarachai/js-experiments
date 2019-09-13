const http = require('http');
const os = require('os');

const args = {};

process.argv.slice(2 + process.execArgv.length).forEach(rawArg => {
  let prettyArg = rawArg;
  if (rawArg.substring(0, 2) === '--') {
    prettyArg = rawArg.substring(2);
  } else if (rawArg[0] === '-') {
    prettyArg = rawArg.substring(1);
  }
  if (prettyArg.indexOf('=') < 0) {
    if (args[prettyArg])
      console.warn(`Argument ${args[prettyArg]} is rewritten.`);
    args[prettyArg] = true;
  } else {
    const [key, value] = prettyArg.split('=');
    if (args[key])
      console.warn(`Argument ${args[key]} is rewritten.`);
    args[key] = value;
  }
});

const port = +args.port || 3000;

http.createServer((req, res) => {
  const { method, url, headers } = req;
  if (method === 'GET') {
    if (url === '/api') {

    }
    res.writeHead(200);
    res.end(`Version 2. Hello! I am a node ${os.hostname()}`);
  } else {
    res.writeHead(200);
    res.end(`Sorry, unsupported method ${method}`);
  }

}).listen(port, () => {
  console.log(`server started on http://localhost:${port}.`);
});
