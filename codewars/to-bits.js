function toBits(x) {
  var arr = new Array(32).fill(0);
  var mask = 1 << 31;
  for (var i = 0; i < 32; i++) {
    arr[i] = (x & mask) ? 1 : 0;
    mask >>>= 1;
  }
  var str = '';
  for (i = 0; i < 32; i++) {
    str += arr[i];
    if (i % 8 === 7) {
      str += ' ';
    } else if (i % 4 === 3) {
      str += '.';
    }
  }
  return str.trim();
}