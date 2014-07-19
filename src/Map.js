var Trie = require('immutable-trie');
var util = require('./util');
var hash = util.hashCode;
var isValue = util.isValue;

function Map(size, root) {
  this.size = size;
  this.root = root;
  this.hash = hash;
}

Map.Empty = new Map(0, Trie.BitmapIndexedNode.Empty);

Map.prototype.get = function(key) {
  var found = this.root.lookup(0, this.hash(key), key);
  return isValue(found) ? found.value : null;
};

Map.prototype.set = function(key, value) {
  var node = new Trie.LeafNode(this.hash(key), key, value);
  var newRoot = this.root.assoc(0, node);
  return new Map(this.size + 1, newRoot);
};

Map.prototype.has = function(key) {
  return isValue(this.root.lookup(0, this.hash(key), key));
};

Map.prototype.delete = function(key) {
  var newRoot = this.root.without(0, this.hash(key), key);

  if (newRoot === this.root) {
    return this;
  }

  if (newRoot.children.length === 0) {
    return Map.Empty;
  }

  return new Map(this.size - 1, newRoot);
};

Map.prototype.keys = function() {
  var i = -1;

  return this.root.kvreduce(function(keys, key) {
    keys[++i] = key;
    return keys;
  }, new Array(this.size));
};

Map.prototype.values = function() {
  var i = -1;

  return this.root.reduce(function(values, val) {
    values[++i] = val;
    return values;
  }, new Array(this.size));
};

Map.prototype.entries = function() {
  var i = -1;

  return this.root.reduce(function(entries, key, value) {
    entries[++i] = [key, value];
    return entries;
  }, new Array(this.size));
};

Map.prototype.isEmpty = function() {
  return this === Map.Empty;
};

Map.prototype.reduce = function(fn, init) {
  return this.root.reduce(fn, init);
};

module.exports = Map;