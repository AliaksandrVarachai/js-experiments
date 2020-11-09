import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jwt-simple';
import {
  origin,
  pageLoginUrl,
  apiLoginPathname,
  apiRegisterPathname,
  apiRefreshPathname,
  apiRefreshUrl
} from './views/config.js';

const secret = 'secret';
const accessTokenTTL = 10; // sec
const refreshTokenTTL = 10 * 3; // sec

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
    return res.status(200).json(generateTokens(username, true));
  },

  async register(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
      return res.status(401).json({error: {message: `User name "${username}" is already taken.`}});
    }
    // adding the user
    users.push({username, password});
    return res.status(201).end();
  },

  async refresh(req, res) {
    // checks refresh token and provides a new access token
    const { 'x-refresh-token': refreshToken } = req.headers;
    if (!refreshToken) {
      return res.status(401).json(createErrorResponse({
        message: 'Refresh token is not provided',
        redirectUrl: pageLoginUrl
      }));
    }
    const decodedRefreshToken = jwt.decode(refreshToken, secret);
    const { sub: username, exp } = decodedRefreshToken;
    if (exp && +exp > Date.now()) {
      return res.status(200).json(generateTokens(username, false));
    }
    return res.status(403).json(createErrorResponse({
      message: 'Refresh token is expired',
      redirectUrl: pageLoginUrl
    }));
  },

  async data(req, res) {
    const { 'x-access-token': accessToken } = req.headers;

    // no accessToken -> redirect to login page
    if (!accessToken) {
      return res.status(401).json(createErrorResponse({
        message: 'Access token is not provided',
        redirectUrl: pageLoginUrl
      }));
    }

    const decodedAccessToken = jwt.decode(accessToken, secret);
    const accessExp = +decodedAccessToken.exp;

    // accessToken is not expired -> provide data
    if (accessExp && +accessExp > Date.now()) {
      return res.status(200).json({ data });
    }

    // accessToken is expired -> response refresh token flag
    return res.status(401).json(createErrorResponse({
      message: 'Access token is not provided',
      refreshUrl: apiRefreshUrl
    }));



    // console.log(11111);
    // if (!refreshToken) {
    //   return res.status(403).json(createErrorResponse({
    //     message: 'Access token is not provided',
    //     redirectUrl: pageLoginUrl
    //   }));
    // }
    // console.log(refreshToken);
    // const { exp: refreshExp } = jwt.decode(refreshToken, secret);
    // if (accessExp && +refreshExp > Date.now()) {
    //   return res.status(200).json({ data });
    // }
    //
    // return res.status(403).json(createErrorResponse({
    //   message: 'Access token is expired',
    //   refreshUrl: apiRefreshUrl
    // }));
  }
};

function generateTokens(username, withRefreshToken = false) {
  const now = Date.now();
  const accessToken = jwt.encode({
    sub: username,
    exp: now + accessTokenTTL * 1e3
  }, secret);
  const refreshToken = withRefreshToken
    ? jwt.encode({
      sub: username,
      exp: now + refreshTokenTTL * 1e3
    }, secret)
    : null;
  return withRefreshToken
    ? {
      accessToken,
      refreshToken
    } : {
      accessToken
    };
}

function createErrorResponse({ message, redirectUrl = '', refreshUrl }) {
  const errorResponse = {
    error: { message }
  };
  if (redirectUrl) {
    errorResponse.redirectUrl = redirectUrl;
  }
  if (refreshUrl) {
    errorResponse.refreshUrl = refreshUrl;
  }
  return errorResponse;
}

app.post(apiLoginPathname, controller.login);
app.post(apiRegisterPathname, controller.register);
app.get(apiRefreshPathname, controller.refresh);
app.get('/api/data', controller.data);

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
  console.log(`server is started on ${origin}`);
})
