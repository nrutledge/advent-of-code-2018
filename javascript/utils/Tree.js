function Tree() {
  this.root = null;
}

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

Tree.prototype.addValue = function(val) {
  if (this.root === null) {
    this.root = new Node(val);
  } else {
    this.root.addNode(val);
  }
}

Tree.prototype.search = function(val) {
  return this.root.search(val);
}

Node.prototype.addNode = function(val) {
  if (val < this.val) {
    this.left === null ? this.left = new Node(val) : this.left.addNode(val);
  } else if (val > this.val) {
    this.right === null ? this.right = new Node(val) : this.right.addNode(val);
  }
}

Node.prototype.search = function(val) {
  if (val === this.val) {
    return this;
  } else if (val < this.val) {
    return this.left === null ? null : this.left.search(val);
  } else if (val > this.val) {
    return this.right === null ? null : this.right.search(val);
  }
  return null;
}

module.exports = Tree;