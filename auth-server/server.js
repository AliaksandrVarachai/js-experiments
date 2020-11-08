import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const port = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'views'), {}))
app.use(express.json());

const controller = {
  async login(req, res) {
    const { username, password } = req.body;
    // search of the user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({error: {message: `Access denied for user "${username}".`}});
    }
    if (password !== user.password) {
      return res.status(403).json({error: {message: 'Incorrect password.'}});
    }
    // redirect must be provided by the login form
    return res.status(200).json({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    })
  },

  async register(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
      return res.status(401).json({error: {message: `User name "${username}" is occupied.`}});
    }
    // adding the user
    users.push({username, password});
    return res.status(200).json(`User "${username}" is created. Log in please.`)
  },

  async refresh(req, res) {
    const { refreshToken } = req.body;
    // checks refresh token and provides a new pair of tokens
    if (!refreshToken) {
      // TODO: check if the refresh token is expired or revoked
    }
    return res.status(200).json({
      accessToken: 'newAccessToken'
    })
  },

  async data(req, res) {
    const { accessToken, refreshToken } = req.body;
    if (accessToken) {
      // refreshToken is not expired
      return res.status(200).json({ data });
    }
    if (refreshToken) {
      // refreshToken is not expired/revoked
      const params = new URLSearchParams();
      params.set('redirect', )
      res.redirect('');
      // TODO: redirect to api/refresh
      return res.status(400).json({error: {message: 'refresh is not implemented yet'}});
    }
    // TODO: redirect to api/login
    return res.status(400).json({error: {message: 'login redirect is not implemented yet'}});
  }
};

app.post('/api/login', controller.login);
app.post('/api/register', controller.register);
app.post('/api/refresh', controller.refresh);
app.post('/api/data', controller.data);

const users = [
  {
    username: 'a',
    password: 'a'
  }
];

const data = {
  content: 'Some confidential info'
}


app.listen(port, () => {
  console.log(`server is started on http://localhost:${port}`);
})
