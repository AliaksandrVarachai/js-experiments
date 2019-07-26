function convertToString(bits) {
  function double(arr) {
    var buff = 0;
    for (var i = arr.length - 1; i > -1; i--) {
      p = 2 * arr[i] + buff;
      buff = Math.floor(p / 10);
      arr[i] = p % 10;
    }
    if (buff) {
      arr.unshift(buff);
    }
  }

  function addNumber(arr, number) {
    var buff = 0;
    var i = arr.length - 1;
    var p = arr[i] + number;
    arr[i] = p % 10;
    buff = Math.floor(p / 10);
    i--;
    while(i > -1 && buff) {
      p = arr[i] + buff;
      buff = Math.floor(p / 10);
      i--;
    }
    if (buff) {
      arr.unshift(buff);
    }
  }

  var i = bits.length - 1;
  var result = [bits[i]];
  i--;
  while(i > -1) {
    //debugger;
    double(result);
    addNumber(result, bits[i]);
    i--;
  }
  return result.join('');
}

/**
 * Converts string to a bit array with REVERSE order. Heading zeroes are ignored.
 * @param str {string} - string consists of integers 0...9.
 * @returns {number[]} - array containing integers 0 or 1.
 */
function convertToBits(str) {
  var result = [];
  var a = str.split('').map(x => parseInt(x, 10));
  var len = a.length;
  while (len > 1 || a[0]) {
    var q, r = 0;
    for(var i = 0; i < len; i++) {
      var num = a[i] + 10 * r;
      q = num >> 1;
      r = num % 2;
      a[i] = q;
    }
    result.push(r);
    var headZeroesNumber = 0;
    while (!a[headZeroesNumber] && headZeroesNumber < len - 1) {
      headZeroesNumber++;
    }
    a.splice(0, headZeroesNumber);
    len = a.length;
  }
  return result;
}


function add(s1, s2) {
  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);
  var l1 = b1.length;
  var l2 = b2.length;
  var maxB, minL, maxL, i;
  var buff = 0;
  var result = [];
  if (l1 >= l2) {
    maxB = b1;
    maxL = l1;
    minL = l2;
  } else {
    maxB = b2;
    maxL = l2;
    minL = l1;
  }
  for (i = 0; i < minL; i++) {
    result.push(b1[i] ^ b2[i] ^ buff);
    buff = buff & (b1[i] | b2[i]) | b1[i] & b2[i];
  }
  while(buff && i < maxL) {
    result.push(maxB[i] ^ buff);
    buff = buff & maxB[i];
    i++;
  }
  while(i < maxL) {
    result.push(maxB[i]);
    i++;
  }
  if (buff) {
    result.push(buff);
  }
  return convertToString(result);
  //return parseInt(result.reverse().join(''), 2);
}

function subtract(s1, s2) {
  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);
  var l1 = b1.length;
  var l2 = b2.length;
  if (l1 < l2)
    throw Error('Subtraction: the first value must be more or equal then the second one.');
  var i;
  var buff = 0;
  var result = [];
  for (i = 0; i < l2; i++) {
    result.push(b1[i] ^ ~b2[i] ^ ~buff);
    buff = buff & b2[i] | ~b1[i] & (b2[i] | buff);
  }
  while(buff && i < l1) {
    result.push(b1[i] ^ buff);
    buff = buff & ~b1[i];
    i++;
  }
  while(i < l1) {
    result.push(b1[i]);
    i++;
  }
  if (buff) {
    result.push(buff);
  }
  return convertToString(result);
}


function multiply(s1, s2) {
  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);

  // TODO: implement;
  var result = '0';
  return result;
}

function divide(s1, s2) {
  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);

  // TODO: implement;
  var result = '0';
  return result;
}

var s1 = '1666';
var s2 = '333';
console.log(`${s1} + ${s2} = ${add(s1, s2)}`);
console.log(`${s1} - ${s2} = ${subtract(s1, s2)}`);
