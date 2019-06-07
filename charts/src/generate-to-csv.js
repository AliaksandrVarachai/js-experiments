const fs = require('fs');
const path = require('path');
const { generateValues } = require('./random-generator');


const dist = path.resolve(__dirname, '../dist');
const filename = `file-${generateIndex()}.csv`;
const filepath = path.resolve(dist, filename);
const distributionOptions = parseArgv();
if (distributionOptions === null)
  throw Error('Wrong arguments');

fs.writeFileSync(filepath, convertToCSV(['ValueX'], generateValues(distributionOptions)));


function generateIndex() {
  const len = 4;
  let strIndex = Math.round(Math.random() * 10**len).toString();
  return '0'.repeat(len - strIndex.length) + strIndex;
}

function convertToCSV(headers, array) {
  return headers.join(',') + '\n' +
    array.reduce((acc, line) => {
      return acc + (Array.isArray(line) ? line.join(',') : line + '\n')
    }, '')
}

// name=normal lenath=10 mean=30 sigma=40,
// returns null if wrong arguments
function parseArgv() {
  const [,, ...argv] = process.argv;
  const distributionOptions = {
    name: '',
    length: 0,
    params: {}
  };
  for (let i = 0; i < argv.length; i++) {
    const param = argv[i];
    const [key, value] = param.split(/\s*=\s*/);
    if (!key || !value) {
      console.log(`Argument "${param}" cannot be parsed`);
      return null;
    }
    switch (key) {
      case 'name':
        distributionOptions.name = value;
        break;
      case 'length':
        distributionOptions.length = parseInt(value, 10);
        break;
      default:
        distributionOptions.params[key] = parseFloat(value);
    }
  }
  return distributionOptions;
}


