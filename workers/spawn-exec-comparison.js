const { spawn, exec } = require('child_process');

// executes module without a shell (with _streamed_ output)
const spawned = spawn('node', ['spawn-exec-comparison-helper.js']);
spawned.stdout.on('data', (msg) => {
  process.stdout.write(`spawn:${msg}`);
});

// executed module with a shell
const executed = exec('node spawn-exec-comparison-helper.js', (error, stdout, stderr) => {
  console.log(`exec:${stdout}`);
});