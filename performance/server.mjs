import express from 'express';
import crypto from 'crypto';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

// emulation of DB
const users = {};

app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});

app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  const { salt, hash } = users[username];
  // const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  crypto.pbkdf2(password, salt, 10000, 512, 'sha512', (err, encryptHash) => {
    if (err) return res.sendStatus(400);
    if (crypto.timingSafeEqual(hash, encryptHash)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
  //
  // if (crypto.timingSafeEqual(hash, encryptHash)) {
  //   res.sendStatus(200);
  // } else {
  //   res.sendStatus(401);
  // }
});


await (() => {})();
