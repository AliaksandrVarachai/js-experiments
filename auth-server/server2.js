import express from 'express';

const port = 3002;

const app = express();

const controller = {
  async ping(req, res) {
    return res.status(200).json("pong");
  }
};

app.post('/ping', controller.ping);


app.listen(port, () => {
  console.log(`server is started on http://localhost:${port}`);
})
