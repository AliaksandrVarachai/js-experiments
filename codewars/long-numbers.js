/**
 * Application provides 4 arithmetic operations for long integers (up to 1000 numbers and even more).
 */

/**
 * Converts a REVERSE array of 0 or 1 numbers to a string consists of 0...9 (without heading zeroes);
 * @param bits {number[]} - array of integers 0 or 1.
 * @returns {string} - string consists of integers 0...9.
 */
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
    var i = arr.length - 1;
    var p = arr[i] + number;
    arr[i] = p % 10;
    var buff = Math.floor(p / 10);
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
  return result.length ? result : [0];
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
  var l1 = b1.length;
  var l2 = b2.length;
  var result = [];
  var i, j;
  for (i = 0; i < l1; i ++) {
    result.push(0);
  }
  for (i = 0; i < l2; i++) {
    var b = b2[i];
    var buff = 0;
    for (j = 0; j < l1; j++) {
      var oldResult = result[i + j] | 0;
      var mul = b1[j] & b;
      result[i + j] ^=  mul ^ buff;
      buff = oldResult & (mul | buff) | mul & buff;
    }
    if(buff) {
      result[i + j] = buff;
    }
  }
  return convertToString(result);
}


function divide(s1, s2) {
  // Returns: positive int, if b1 > b2;
  //          negative int, if b2 > b1;
  //          0,            if b2 = b1
  function compare(b1, b2) {
    var l1 = b1.length;
    var l2 = b2.length;
    if (l1 !== l2)
      return l1 - l2;
    var i = l1 - 1;
    while (i > -1 && b1[i] === b2[i]) {
      i--;
    }
    return i > -1 ? b1[i] - b2[i] : 0;
  }

  // For strict inequation only: b1 > b2
  function sub(b1, b2) {
    var buff = 0;
    var l1 = b1.length;
    var l2 = b2.length;
    var result = [];
    var i = 0;
    for (i = 0; i < l2; i++) {
      result.push(b1[i] ^ ~b2[i] ^ ~buff);
      buff = b1[i] & b2[i] & buff | ~b1[i] & (buff | b2[i]);
    }
    while (i < l1) {
      result.push(b1[i] ^ buff);
      buff = ~b1[i] & buff;
      i++;
    }
    removeHeaderZeroes(result);
    return result;
  }

  // Removes heading zeroes from a bit array (it's tail here because the reverse order of bits)
  function removeHeaderZeroes(b) {
    for (var i = b.length - 1; i > 0 && !b[i]; i--) {
      b.pop();
    }
  }


  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);
  var result = [];
  var rest = [];
  var addZero = false;

  if (!compare(b2, [0]))
    throw Error('Division by zero is forbidden.');

  var compareResult = compare(b1, b2);
  if (compareResult < 0) {
    return '0';
  } else if (compareResult === 0) {
    return '1'
  }

  // case b1 > b2
  for (var i = b1.length - 1; i > -1; i--) {
    rest.unshift(b1[i]);
    removeHeaderZeroes(rest);
    compareResult = compare(rest, b2);
    if (compareResult < 0) {
      if (addZero) {
        result.unshift(0);
      }
    } else {
      result.unshift(1);
      rest = compareResult ? sub(rest, b2) : [0];
      addZero = true;
    }
  }

  return convertToString(result);
}

// Tests:
var s1 = '5456465465465655298797899456';
var s2 = '897987946546546549879987';
console.log(`${s1} + ${s2} = ${add(s1, s2)}`);
console.log(`${s1} - ${s2} = ${subtract(s1, s2)}`);
console.log(`${s1} * ${s2} = ${multiply(s1, s2)}`);
console.log(`${s1} / ${s2} = ${divide(s1, s2)}`);
