/**
 * Converts array number to a bit array with REVERSE order. Heading zeroes are ignored.
 * @param arr {number[]} - array containing integers 0...9.
 * @returns {number[]} - array containing integers 0 or 1.
 */
function convertToBits(arr) {
  var tempArr = arr;
  var rests = [];
  do {
    var tempRest = 0;
    var tempQuotients = [];
    var headingZeroes = true;
    var number = 0;
    for (var i = 0, len = tempArr.length; i < len; i++) {
      number = tempArr[i] + 10 * tempRest;
      if (headingZeroes && number < 2) {
        tempRest = number;
        continue;
      }
      headingZeroes = false;
      tempRest = number % 2;
      tempQuotients.push(number >> 1);
    }
    rests.push(tempRest);
    tempArr = tempQuotients;
  } while(tempArr.length > 1 || tempArr[0] > 1);

  if (tempArr.length === 0)
    return [0];

  rests.push(1);
  return rests;
}

function convertToString(bits) {

}

/*
// test
var s = '0123789745646546546454654687987897987987987897987987979879877987987987987987987546546546546546565465465465546546540456';
var a = s.split('').map(v => parseInt(v, 10));
var binary = divide2(a).reverse().join('');
console.log(parseInt(s, 10) === parseInt(binary, 2))
console.log(binary)

*/


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

  return parseInt(result.reverse().join(''), 2);
}

function subtract(s1, s2) {
  var b1 = convertToBits(s1);
  var b2 = convertToBits(s2);

  // TODO: implement;
  var result = '0';
  return result;
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

console.log(add('55', '22'));