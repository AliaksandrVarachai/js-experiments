const http = require('http');
const url = require('url');
const cephes = require('cephes');
const fs = require('fs');


const SERVER_PORT = 9091;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;
const server = http.createServer();

server.on('request', (req, res) => {
  const { pathname, search } = url.parse(req.url);

  if (req.method === 'GET' && pathname === '/data') {
    const searchParams = new URLSearchParams(search);
    const distributionOptions = {
      name: '',
      length: 0,
      params: {}
    };
    searchParams.forEach((value, name) => {
      switch (name) {
        case 'name':
          distributionOptions.name = value;
          break;
        case 'length':
          distributionOptions.length = parseInt(value, 10);
          break;
        default:
          distributionOptions.params[name] = parseFloat(value);
      }
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    //res.write(JSON.stringify(generateValues()));
    return res.end(JSON.stringify(generateValues(distributionOptions)));
  } else

  if (req.method === 'OPTIONS' && pathname === '/data') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',  // TODO: check http://localhost:9091
      'Access-Control-Allow-Headers': 'My-Custom-Header'
      // 'Access-Control-Allow-Methods': 'GET,POST',
    });
    return res.end();
  }

  console.log(`"${req.method}" request to "${req.url}" was not processed.`)

});

server.listen(SERVER_PORT, () => console.log(`Server started on ${SERVER_URL}`));

// returns array of values or null
function generateValues({ name = 'normal', length = 100, params = {} }) {
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
