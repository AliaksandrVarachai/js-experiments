const { spawn } = require('child_process');

const find = spawn('find', ['.', '-type', 'f']);
const wc = spawn('wc', ['-l']);

// find.stdout.on('data', data => {
//     console.log(data)
// });

find.stdout.pipe(wc.stdin);

process.stdin.pipe(wc.stdin);

wc.stdout.on('data', data => {
    console.log(`Number of files ${data}`);
});
