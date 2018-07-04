console.log('script #1 is running...');

setTimeout(() => {
  console.log('script #1: 1000 ms event');
}, 1000);

setTimeout(() => {
  console.log('script #1: 500 ms event');
}, 500);

process.on('exit', () => {
  console.log('script #1 is closed');
});
