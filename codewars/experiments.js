var start = Date.now();
var max = 5e7;

var arr = [];
//var arr = new Int32Array(max);
for (var i = 0; i < max; i++) {
  arr.push(i);
  // arr[i] = i;
}
var stop = Date.now();

console.log('Total time: ' + (stop - start));
