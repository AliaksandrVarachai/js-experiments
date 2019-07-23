function Heap(size = 16) {
  this.size = size;
  this.top = -1;
  this.array = new Array(size); // It does not make sense
}

Heap.prototype.add = function(item) {
  if (this.top === this.size - 1) {
    this.size *= 2;
    var newArray = new Array(this.size);
    this.array =
  }
};