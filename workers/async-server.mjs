import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3001;
const slowServerPort = 3002;

app.get('/call-to-slow-server', async (req, res) => {
  const result = await fetch(`http://localhost:${slowServerPort}/slow-request`);
  res.json(await result.json());
});

app.get('/rest-request', async (req, res) => {
  res.send("I'm unblocked now");
});

app.listen(port, () => console.log(`listening on port ${port}`));