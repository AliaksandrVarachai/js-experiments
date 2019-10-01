function BinaryTree() {}

function BinaryTreeNode(value, left, right) {
  this.value = value;
  this.left = left;
  this.right = right;
  Object.freeze(this);
}
BinaryTreeNode.prototype = new BinaryTree();
BinaryTreeNode.prototype.constructor = BinaryTreeNode;

BinaryTreeNode.prototype.isEmpty = function() { return false };
BinaryTreeNode.prototype.depth = function() { return 1 + Math.max(this.left.depth(), this.right.depth()); };
BinaryTreeNode.prototype.count = function() { return 1 + this.left.count() + this.right.count(); };

BinaryTreeNode.prototype.inorder = function(fn) { this.left.inorder(fn); fn(this.value); this.right.inorder(fn); };
BinaryTreeNode.prototype.preorder = function(fn) { fn(this.value); this.left.preorder(fn); this.right.preorder(fn); };
BinaryTreeNode.prototype.postorder = function(fn) { this.left.postorder(fn); this.right.postorder(fn); fn(this.value); };

BinaryTreeNode.prototype.contains = function(x) { return this.value === x || this.left.contains(x) || this.right.contains(x); };

BinaryTreeNode.prototype.insert = function(x) {
  if (x < this.value)
    return new BinaryTreeNode(this.value, this.left.insert(x), this.right);
  return new BinaryTreeNode(this.value, this.left, this.right.insert(x));
};

BinaryTreeNode.prototype.copyTreeUntilSuccessor = function() {
  if (this.left.isEmpty())
    return {tree: new EmptyBinaryTree(), successor: this.value};
  var { tree, successor } = this.left.copyTreeUntilSuccessor();
  return {tree: new BinaryTreeNode(this.value, tree, this.right), successor};
};

BinaryTreeNode.prototype.removeExistent = function(x) {
  if (x < this.value)
    return new BinaryTreeNode(this.value, this.left.removeExistent(x), this.right);
  if (x > this.value)
    return new BinaryTreeNode(this.value, this.left, this.right.removeExistent(x));
  // x === this.value
  if (this.left.isEmpty()) {
    if (this.right.isEmpty())
      return new EmptyBinaryTree();
    else
      return this.right;
  } else {
    if (this.right.isEmpty())
      return this.left;
    else {
      // removes the rest between this and successor
      var { tree, successor } = this.right.copyTreeUntilSuccessor();
      return new BinaryTreeNode(successor, this.left, tree);
    }
  }
};

BinaryTreeNode.prototype.remove = function(x) {
  if (this.contains(x))
    return this.removeExistent(x);
  return this;
};

////////////////////////////////////////////////////////////////////////
function EmptyBinaryTree() { Object.freeze(this); }
EmptyBinaryTree.prototype = new BinaryTree();
EmptyBinaryTree.prototype.constructor = EmptyBinaryTree;

EmptyBinaryTree.prototype.isEmpty = function() { return true; };
EmptyBinaryTree.prototype.depth = function() { return 0; };
EmptyBinaryTree.prototype.count = function() { return 0; };

EmptyBinaryTree.prototype.inorder = function(fn) {};
EmptyBinaryTree.prototype.preorder = function(fn) {};
EmptyBinaryTree.prototype.postorder = function(fn) {};

EmptyBinaryTree.prototype.contains = function(x) { return false; };
EmptyBinaryTree.prototype.insert = function(x) {
  return new BinaryTreeNode(x, new EmptyBinaryTree(), new EmptyBinaryTree());
};
EmptyBinaryTree.prototype.remove = function(x) { return this; };

// tests

function insertArray(srcTree, arr) {
  return arr.reduce((tree, val) => tree.insert(val), srcTree);
}
var t1 = insertArray(new EmptyBinaryTree(), [8,4,12 /*,14,10,15,13,11,9,2,1,3,6,5,7,0*/]);
// var t1 = insertArray(new EmptyNode(), [4,3,5,1]);
// var t2 = t1.remove(4);
// console.log(t2)
var arr = [];
t1.inorder(v => arr.push(v));
console.log(arr);
var t2 = t1.remove(12);
// console.log(t1);
arr = [];
t2.inorder(v => arr.push(v));
console.log(arr);
