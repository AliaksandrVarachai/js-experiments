const express = require('express');

const app = express();
const port = 3000;

app.get('/getfibonacci', async (req, res) => {
  const startTime = new Date();
  const n = parseInt(req.query.number);
  console.log(`Received a request with parameter ${n}`);
  const result = await fibonacciAsync(n);
  const endTime = new Date();
  res.json({
    number: n,
    fibonacci: result,
    time: endTime.getTime() - startTime.getTime() + 'ms',
  });
  console.log(`Fibonacci for ${n} is sent`);
});

const fibonacci = (n) => n > 1 ? fibonacci(n - 1) + fibonacci(n - 2) : 1;

const fibonacciAsync = async (n) => fibonacci(n);

app.listen(port, () => console.log(`listening on port ${port}`));