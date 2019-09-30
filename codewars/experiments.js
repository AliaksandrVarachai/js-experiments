function AbstractNode() {}

function Node(v, l, r) { this.v = v; this.l = l; this.r = r; }
Node.prototype = new AbstractNode();
Node.prototype.constructor = Node;
Node.prototype.isEmpty = function() { return false; };

function EmptyNode() {}
EmptyNode.prototype = new AbstractNode();
EmptyNode.prototype.constructor = EmptyNode;
EmptyNode.prototype.isEmpty = function() { return true; };
EmptyNode.prototype.inorder = function(fn) {};
var empty = new EmptyNode(); //if I use it I will face with equality of all empty elements. Is it good??
EmptyNode.prototype.insert = function(v) {
  return new Node(v, empty, empty);
  //   this.v = v; this.l = new EmptyNode(); this.r = new EmptyNode();
  //   Object.assign(this, node);
};


Node.prototype.insert = function(v) {
  var node = this; // top of the tree
  while (true) {
    if (v < node.v) {
      if (node.l.isEmpty()) {
        node.l = new Node(v, empty, empty);
        break;
      }
      node = node.l;
    } else {
      if (node.r.isEmpty()) {
        node.r = new Node(v, empty, empty);
        break;
      }
      node = node.r;
    }
  }
  return this;
};

Node.prototype.inorder = function(fn) {
  this.l.inorder(fn);
  fn(this.v);
  this.r.inorder(fn);
};

Node.prototype._leftmostParent = function() {
  if (this.l.isEmpty())
    return empty;
  var lp = this.l._leftmostParent();
  return lp.isEmpty() ? this : lp;
};

Node.prototype.getSuccessorParent = function() {
  if (this.r.isEmpty())
    return empty;
  var leftmostParent = this.r._leftmostParent();
  return leftmostParent.isEmpty() ? this : leftmostParent;
};

Node.prototype.remove = function(v) {
  var node = this;
  var successorParent;
  if (node.isEmpty())
    return this;
  if (node.v === v) {
    // will be processed by while cicle (right branch)
    node = new Node(node.v - 1, new EmptyNode(), node);
  }
  while (true) {
    if (v < node.v) {
      if (node.l.isEmpty())
        break; // nothing to remove
      var l = node.l;
      if (l.v === v) {
        if (l.l.isEmpty())
          l = l.r;
        else if (l.r.isEmpty())
          l = l.l;
        else {
          successorParent = l.getSuccessorParent(); // cannot be empty!!!
          if (successorParent === l) { // the nearest right element is successor
            l.v = l.r.v;
            l.r = l.r.r;
          } else {
            l.v = successorParent.l.v;
            successorParent.l = empty;
          }
        }
        break;
      }
      node = node.l;
    } else {
      if (node.r.isEmpty())
        break; // nothing to remove
      var r = node.r;
      if (r.v === v) {
        if (r.l.isEmpty())
          r = r.r;
        else if (r.r.isEmpty())
          r = r.l;
        else {
          successorParent = r.getSuccessorParent(); // cannot be empty!!!
          if (successorParent === r) { // the nearest left element is successor
            r.v = r.r.v;
            r.l = r.r.l;
          } else {
            r.v = successorParent.l.v;
            successorParent.l = empty;
          }
        }
        break;
      }
    }
  }
  return this;
};

function insertArray(srcTree, arr) {
  return arr.reduce((tree, val) => tree.insert(val), srcTree);
}
var t1 = insertArray(new EmptyNode(), [8,4,12,14,10,15,13,11,9,2,1,3,6,5,7,0]);
// var t2 = t1.remove(4);
// console.log(t2)
var arr = [];
t1.inorder(v => arr.push(v));
console.log(arr);
t1.remove(1);
console.log(t1);
t1.inorder(v => arr.push(v));
console.log(arr);















