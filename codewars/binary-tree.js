'use explicit';

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


BinaryTreeNode.prototype.remove = function(x) {
  if (x < this.value)
    return new BinaryTreeNode(this.value, this.left.remove(x), this.right);
  if (x > this.value)
    return new BinaryTreeNode(this.value, this.left, this.right.remove(x));
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
  return arr.reduce((tree, val, i) => {
    global['t' + i] = tree.insert(val);
    return global['t' + i];
  }, srcTree);
}
function getArray(tree) {
  var arr = [];
  tree.inorder(v => arr.push(v));
  return arr;
}

var arr = [8,4,12,14,10,15,13,11,9,2,1,3,6,5,7,0];
orig = insertArray(new EmptyBinaryTree(), arr);
for (var i = 0; i < arr.length; ++i) {
  for (var j = 0; j < arr.length; ++j) {
    if (i === j)
      continue;
    if (global['t' + i] === global['t' + j])
      throw Error('Objects must be different');
  }
}

var tr14 = orig.remove(14);
var tr6 =  orig.remove(6);
var ti6 =  orig.insert(6);
var tr4 =  orig.remove(4);
var tr12 = orig.remove(12);

function comparePairs(...args) {
  for (var i = 0; i < args.length; ++i) {
    for (var j = 0; j < args.length; ++j) {
      if (i === j)
        continue;
      if (args[i] === args[j])
        throw Error('Arguments must be different');
    }
  }
}

comparePairs(tr14, tr6, ti6, tr4, tr12);

function isContain(x, ...args) {
  for (var i = 0; i < args.length; ++i) {
    console.log(getArray(args[i]), args[i].contains(x));
  }
}

function printTree(tree) {


}

isContain(5, ...(arr.map((_, i) => global['t' + i])), tr14, tr6, ti6, tr4, tr12);
debugger;

// console.log(getArray(orig), 'orig', orig.contains(5), orig.depth(), orig.count())
// var insert0 = orig.insert(0);
// console.log(getArray(insert0), 'insert0', insert0.contains(5), insert0.depth(), insert0.count())
// var remove4 = orig.remove(4);
// console.log(getArray(remove4), 'remove4', remove4.contains(5), remove4.depth(), remove4.count())
// var remove6 = orig.remove(6);
// console.log(getArray(remove6), 'remove6', remove6.contains(5), remove6.depth(), remove4.count())
// var orig5 = insertArray(new EmptyBinaryTree(), [8,4,12,14,10,15,13,11,9,2,1,3,6]);
// console.log(getArray(remove6), 'remove6', remove6.contains(5))
