process.title = 'websocket-chat';

const WebSocketServer = require('websocket').server;
const http = require('http');

const port = 1337;

const history = [];
const clients = [];



const server = http.createServer((req, res) => {
  // process HTTP request (nothing need to be implemented)
});
server.listen(port, () => {
  console.log( `${new Date().toISOString()}: websocket server is listened on ${port} port`);
});

wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', (req) => {
  console.log(`${new Date().toISOString()}: connection from origin ${req.origin}`);
  const connection = req.accept(null, req.origin);
  const index = clients.push(connection) - 1;
  let userName = false;
  console.log(`${new Date().toISOString()}: connection accepted`);

  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(JSON.stringify({ type: 'history', data: history }));
  }

  // if user sent some message
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      // first message sent by a user is their name
      if (userName === false) {
        userName = message.utf8Data;
        connection.sendUTF(JSON.stringify({ type: 'greeting', data: `Hi ${userName}!` }));
        console.log(`${new Date().toISOString()}: received message from ${userName}: ${message.utf8Data}`);
      } else {
        // log and broadcast the message
        console.log(`${new Date().toISOString()}: received message from ${userName}: ${message.utf8Data}`);
        const obj = {
          time: Date.now(),
          text: message.utf8Data,
          author: userName
        };
        history.push(obj);
        if (history.length > 100) history.shift();
        const json = JSON.stringify({ type: 'message', data: obj });
        clients.forEach(client => { client.sendUTF(json) });
      }
    }
  });

  // user disconnected
  connection.on('close', (connection) => {
    if (userName !== false) {
      console.log(`${new Date().toISOString()}: connection ${connection.remoteAddress} disconnected`);
      clients.splice(index, 1);

    }
  });
});