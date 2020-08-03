const fs = require('fs');

fs.stat('.', (err, stats) => {
  console.log(stats);
});

fs.open('./.', (err, fd) => {
  console.log('opened', fd);
  fs.close(fd, (err) => {
    if (err) console.log(err.message);
    console.log('closed')
  });
});



