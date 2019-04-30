#!/usr/bin/env node

const util = require('util');
const fs = require('fs');
const path = require('path');

const [,, ...argv] = process.argv;

const defaultOptions = {
  destPath: {
    value: './dist/output.txt',
    desc: 'Destination path for output file'
  },
  totalLines: {
    value: 10,
    desc: 'Number of lines in generated file'
  },
  lineLength: {
    value: 50,
    desc: 'Number of symbols on one line'
  }
};

if (argv[0] === 'help') {
  console.log('Provided values:')
  Object.keys(defaultOptions).forEach(optionName => {
    const option = defaultOptions[optionName];
    console.log(util.format('  %s: %s',  option.value, option.desc));
  });
  process.exit();
}

const argvMap = {};
let hasArgvPairs = false;
for (const pair of argv) {
  console.log(pair)
  const [ key, val ] = pair.split('=');
  if (!val) {
    if (hasArgvPairs)
      throw Error('All arguments must be ordered or be paired with "=" sign');
    continue;
  }
  argvMap[key] = val;
  hasArgvPairs = true;
}

function generateFile(destPath = defaultOptions.destPath.value, totalLines = defaultOptions.totalLines.value, lineLength = defaultOptions.lineLength.value) {

  const line = new Array(lineLength).fill('x').join('');
  const data = new Array(totalLines).fill(line).join('\n');

  fs.writeFile(destPath, data, err => {
    if (err)
      throw err;
    console.log(`File ${destPath} is written successfully.`);
  });
  console.log(`generateFile is called with arguments:`);
  console.log(`  destPath   = ${destPath}`)
  console.log(`  totalLines = ${totalLines}`)
  console.log(`  lineLength = ${lineLength}`)
}


if (hasArgvPairs) {
  generateFile(argvMap['output-path'], argvMap['total-lines'], argvMap['line-length']);
} else {
  generateFile(...argv);
}
