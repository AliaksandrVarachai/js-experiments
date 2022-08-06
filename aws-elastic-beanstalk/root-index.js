const express = require('express');
require('dotenv').config();
// require('dotenv').config({ path: './.env.eb' });
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('originalUrl', req.originalUrl); // /product/main?res=all
  console.log('method', req.method);
  console.log('body', req.body);

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);

  const recipientUrl = process.env[recipient];
  console.log('recipientURL', recipientUrl);
  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: recipientUrl,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    };
    console.log('axiosConfig', axiosConfig);

    axios(axiosConfig)
      .then(response => {
        console.log('response from recipient', response.data);
        res.json(response.data);
      })
      .catch(error => {
        console.log('some error: ', JSON.stringify(error));
        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
  console.log('');
});

app.listen(PORT, () => {
  console.log(`Example app is listening at http://localhost:${PORT}`);
});

