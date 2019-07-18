var start = Date.now();
var max = 1e9;

//var x = 0;
//for (var j = 0; j < max; j++) {
//  for (var i = 0; i < max; i++) {
//    //x = Math.floor(Math.random());
//    x = ~~Math.random();
//  }
//}

//var arr = new Int32Array(max).fill(1);
//var last = arr[max - 1];

//var arr = new Array(max).fill(1);
//var last = arr[max - 1];
var z;
for (var i = 0; i < max; i++) {
  //arr[i] = 10;
  //z = i % 32;
  z = i << 27 >>> 27;
}

var stop = Date.now();

console.log('bit increment: ' + (stop - start));