console.log('script #2 is running...');

setTimeout(() => {
  console.log('script #2: 2000 ms event');
}, 2000);

setTimeout(() => {
  console.log('script #2: 200 ms event');
}, 200);

process.on('exit', () => {
  console.log('script #2 is closed');
});
