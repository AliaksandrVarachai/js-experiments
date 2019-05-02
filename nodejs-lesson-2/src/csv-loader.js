const readline = require('readline');
const fs = require('fs');


function createCsvObject(fieldNames, values, isEmptyAllowed = false) {
  if (!isEmptyAllowed && fieldNames.length > values.length)
    throw Error(`Discrepancy between values and names:\nfields: ${fieldNames}\nvalues: ${values}`);
  const csvObject = {};
  fieldNames.forEach((field, inx) => {
    csvObject[field] = values[inx];
  });
  return csvObject;
}


function parseLine(csvLine) {
  const fields = [];
  let isQuotationMarkOpened = false;
  let ignoreNextChar = false;
  let startPos = 0;

  for (let i = 0, len = csvLine.length; i < len; i++) {
    const c = csvLine[i];

    if (c === '"') {
      if (isQuotationMarkOpened) {
        fields.push(csvLine.substring(startPos, i));
      }
      isQuotationMarkOpened = !isQuotationMarkOpened;
      startPos = i + 1;
    } else

    if ((c === ' ' || c === ',') && !isQuotationMarkOpened) {
      if (startPos === i) {
        startPos = i + 1;
      } else {
        fields.push(csvLine.substring(startPos, i));
        startPos = i + 1;
      }
    } else

    if (i === len - 1) {
      if (isQuotationMarkOpened) {
        throw Error(`Quotation mark is not closed: "${csvLine[0]}".`);
      } else {
        fields.push(csvLine.substring(startPos, len));
      }
    }
  }

  return fields;
}

// TODO: callback(err, csvObjects)
function load(filePath, callback) {
  const csvObjects = [];
  let isFirstLine = true;
  let fieldNames = [];

  fs.access(filePath, fs.constants.R_OK, err => {
    if (err)
      return callback(err);

    let rl = readline.createInterface({
      input: fs.createReadStream(filePath)
    });

    rl.on('line', rawLine => {
      const line = rawLine.trim();
      if (!line)
        return;
      if (isFirstLine) {
        try {
          fieldNames = parseLine(line.trim());
        } catch(err) {
          callback(err);
        }
        isFirstLine = false;
        return;
      }
      csvObjects.push(createCsvObject(fieldNames, parseLine(line)));
    });

    rl.on('close', () => {
      console.log(`Data from "${filePath}" is read successfully.`);
      callback(null, csvObjects);
    });

  });
}


module.exports = {
  load
};
