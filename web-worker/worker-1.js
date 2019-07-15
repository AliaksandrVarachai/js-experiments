console.log('Worker #1 started.');

onmessage = function(e) {
  console.log('#1 received:', e.data)
};

throw('Custom error from webworker #1');

//console.log('Life after error.');
