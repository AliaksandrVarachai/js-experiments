import http, { abcd } from 'node:http';

const port = 3000;

// Initialize a local server
const server = http.createServer(/* 'request' listener can be added here */);

//Runs local server
server.listen(port, () => {
  console.log(`Server is started on http://localhost:${port}`);
});


server.on('request', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  if (request.method === 'GET' && request.url === '/index') {
    response.end(JSON.stringify('Index'));
  }
  response.end(JSON.stringify({
    data: 'Hello!'
  }));
});

declare module 'http' {
  // pretends that http.abcd exists
  export function abcd(a: string): string;
  export let cupcake: number;
}

try {
  console.log(http.abcd('name'))
} catch (e) {
  if (!!e && typeof e === 'object' && 'message' in e) {
    console.error(e.message);
  } else {
    console.error('Some error happened');
  }
}

function fetch(num: number): Number | Error {
  if (num > 0) return num;
  throw Error('error');
}

class DatabaseError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = 'DatabaseError';
    // Object.setPrototypeOf(this, DatabaseError.prototype);
    this.code = code;
  }
}



// throws an error

// Sends GET request to another server!
// http.get('http://example.com', (res) => {
//   let rawData = '';
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => { rawData += chunk; });
//   res.on('end', () => {
//      try {
//        const parsedData = JSON.parse(rawData);
//        console.log(`Data: ${parsedData}`);
//      } catch(e: unknown) {
//        if (!!e && typeof e === 'object' && 'message' in e) {
//          console.log(e?.message);
//        } else {
//          console.log('Some error happened');
//        }
//
//      }
//    });
//   res.on('error', (e) => { console.error(`Got error: ${e.message}`) });
// });