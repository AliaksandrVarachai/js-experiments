function List() {}

function EmptyList() {}
EmptyList.prototype = new List();
EmptyList.prototype.constructor = EmptyList;

EmptyList.prototype.toString = function() { return '()'; };
EmptyList.prototype.isEmpty = function() { return true; };
EmptyList.prototype.length = function() { return 0; };
EmptyList.prototype.push = function(x) { return new ListNode(x, this); };
EmptyList.prototype.remove = function(x) { return this; };
EmptyList.prototype.append = function(xs) { return xs; };

function ListNode(value, next) {
  this.value = value;
  this.next = next;
}
ListNode.prototype = new List();
ListNode.prototype.constructor = ListNode;
ListNode.prototype.isEmpty = function() { return false; };

ListNode.prototype.toString = function() {
  var result = '(';
  this.forEach(function(value) { result += value + ' '; });
  result = result.substring(0, result.length - 1) + ')';
  return result;
};

ListNode.prototype.forEach = function(callback) {
  var index = -1;
  var curNode = this;
  do {
    callback(curNode.value, ++index, curNode);
    curNode = curNode.next;
  } while (curNode instanceof ListNode);
};

ListNode.prototype.head = function() { return this.value; };
ListNode.prototype.tail = function() { return this.next;  };

ListNode.prototype.length = function() {
  var index;
  this.forEach(function(val, inx) { index = inx; });
  return index + 1;
};

ListNode.prototype.push = function(x) { return new ListNode(x, this); };

ListNode.prototype.remove = function(x) {
  var savedListNode = this;
  var savedIndex = 0;
  this.forEach(function(value, inx, listNode) {
    if (value === x) {
      savedIndex = inx + 1;
      savedListNode = listNode.next;
    }
  });

  if (savedIndex === 0)
    return this;

  if (savedListNode instanceof EmptyList)
    return savedListNode;

  var resultNodeList = null;
  var curNode = null
  this.forEach(function(value, inx) {
    if (value === x || inx > savedIndex)
      return;
    if (resultNodeList === null) {
      resultNodeList = inx < savedIndex ? new ListNode(value) : savedListNode;
      curNode = resultNodeList;
    } else {
      curNode.next = inx < savedIndex ? new ListNode(value) : savedListNode;
      curNode = curNode.next;
    }
  });
  return resultNodeList;
};

ListNode.prototype.append = function(xs) {
//   console.log(this.toString());
//   console.log(xs.toString());
  if (xs instanceof EmptyList)
    return this;

  var appendedList = null;
  var curListNode = null;


  xs.forEach(function(val) {
    if (appendedList === null) {
      appendedList = new ListNode(val);
      curListNode = appendedList;
    } else {
      curListNode.next = new ListNode(val);
      curListNode = curListNode.next;
    }
  });
  curListNode.next = this;
//   console.log('=>' + appendedList.toString());

  return appendedList;
};


// Test
var mt, l1, l2, l3, l4;
mt = new EmptyList();
l1 = mt.push('c').push('b').push('a');
console.log(l1.toString());
l2 = l1.append(l1);
l3 = l1.remove('b');
l4 = l2.remove('b');
