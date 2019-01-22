const tick = () => console.log('tick');

for (let i = 0; i < 5; i++) {
  console.log(i);
}

http = require('http');
var server = new http.Server(function(req, res) {}).listen(3000);

const interval = setInterval(function() {
  console.log(process.memoryUsage());
}, 1000);

interval.unref();
interval.ref();