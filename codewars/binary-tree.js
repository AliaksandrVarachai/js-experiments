function BinaryTree() {};

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
  var stack = [{back: null, node: this}];
  var inx = 0;
  var ptr = stack[inx];
  var node = ptr.node;
  while (!(node instanceof EmptyBinaryTree)) {
    stack.push({back: ptr, node: node.left, child: 0}, {back: ptr, node: node.right, child: 1});
    ptr = stack[++inx];
    node = ptr.node;
  }
  var newTree = new BinaryTreeNode(x, node, new EmptyBinaryTree());
  var addedChild = ptr.child;
  ptr = ptr.back;
  while (ptr) {
    node = ptr.node;
    if (addedChild === 0)
      newTree = new BinaryTreeNode(node.value, newTree, node.right);
    else
      newTree = new BinaryTreeNode(node.value, node.left, newTree);
    addedChild = ptr.child;
    ptr = ptr.back;
  }
  return newTree;
};
BinaryTreeNode.prototype.remove = function(x) {
  var stack = [{back: null, node: this}];
  var inx = 0;
  var ptr = stack[inx];
  var node = ptr.node;
  while (node && node.value !== x) {
    stack.push({back: ptr, node: node.left, child: 0}, {back: ptr, node: node.right, child: 1});
    ptr = stack[++inx];
    node = ptr.node;
  }
  if (!node)
    return this;
  var removedChild = ptr.child;
  var newTree = null;
  ptr = ptr.back;
  while (ptr) {
    node = ptr.node;
    if (removedChild === 0)
      newTree = new BinaryTreeNode(node.value, newTree || new EmptyBinaryTree(), node.right);
    else
      newTree = new BinaryTreeNode(node.value, node.left, newTree || new EmptyBinaryTree());
    removedChild = ptr.child;
    ptr = ptr.back;
  }
  return newTree || new EmptyBinaryTree();
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
EmptyBinaryTree.prototype.insert = function(x) { return new BinaryTreeNode(x, this, new EmptyBinaryTree()); };
EmptyBinaryTree.prototype.remove = function(x) {};

// tests

var mt = new EmptyBinaryTree;
// var t1 = mt.insert('b').insert('a').insert('c');
// var t2 = t1.remove('a');
// var t3 = t1.remove('z');
function insertArray(srcTree, arr) {
  return arr.reduce((tree, val) => tree.insert(val), srcTree);
}
var t1 = insertArray(mt, [8,4,12,14,10,15,13,11,9,2,1,3,6,5,7,0]);
debugger;
t1.count()
