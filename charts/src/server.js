const http = require('http');
const cephes = require('cephes');

const port = 9091;
const url = `http://localhost:${port}`;
const server = http.createServer();

server.on('request', (req, res) => {
  const { method, url } = req;
  const options = {};

  if (req.method === 'GET' && url === '/data') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': 'GET,OPTIONS',
      'Access-Control-Request-Headers': 'access-control-allow-headers'
    });
    //res.write(JSON.stringify(generateValues()));
    return res.end(JSON.stringify(generateValues(options)));
  } else

  if (req.method === 'OPTIONS' && url === '/data') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',  // TODO: check http://localhost:80
      'Access-Control-Request-Method': 'GET,OPTIONS',
      'Access-Control-Request-Headers': 'access-control-allow-headers'
    });
    return res.end();
  }

  console.log(`"${method}" request to "${url}" was not processed.`)

});

server.listen(port, () => console.log(`Server started on ${url}`));

// returns array of values or null
function generateValues({ name = 'normal', length = 100, params: {} }) {
  // TODO: redo as a ArrayBuffer (application/contet-stream)
  const generatedValues = new Array(length);

  switch (name) {
    case 'normal': {
      const {mean = 0, sigma = 1} = params;
      for (let i = 0; i < length; i++) {
        generatedValues[i] = cephes.ndtri(Math.random()) * sigma + mean;
      }
      return generatedValues;
    }

    case 'uniform': {
      const {min = -10, max = 10} = params;
      for (let i = 0; i < length; i++) {
        generatedValues[i] = (max - min) * Math.random() + min;
      }
      return generatedValues;
    }

    default:
      console.error(`Distribution "${name}" is not supported.`);
      return null;
  }
}
