const express = require('express');
const app = express();
const port = 3002;

app.get('/slow-request', (req, res) => {
  setTimeout(() => {
    res.json({
      message: 'Sorry, I am late',
    });
  }, 10000);
});

app.listen(port, () => console.log(`listening on port ${port}`));
