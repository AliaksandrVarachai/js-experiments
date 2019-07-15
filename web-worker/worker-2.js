console.log('Worker #2 started.');

onmessage = function(e) {
  console.log('#2 received:', e.data)
};
