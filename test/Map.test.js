var chai = require('chai');
var expect = chai.expect;

var Map = require('../src/Map');

function add(x, y) {
  return x + y;
}

function inc(x) {
  return x + 1;
}

describe('Map', function() {
  describe('#set', function() {
    it('should add a new value into empty map', function() {
      var map = Map.Empty.set(1, 1);
      expect(map.has(1)).is.true;
    });

    it('should add several new values into empty map', function() {
      var map = Map.Empty.set(1, 1).set(2, 2).set(3, 3);
      expect(map.has(1)).is.true;
      expect(map.has(2)).is.true;
      expect(map.has(3)).is.true;
    });

    it('should set two values with different keys but equal hashcodes', function() {
      var map = Map.Empty.set('AaAa', 'value1').set('BBBB', 'value2');
      expect(map.get('AaAa')).to.equal('value1');
      expect(map.get('BBBB')).to.equal('value2');
    });

    it('should set three values with different keys but equal hashcodes', function() {
      var map = Map.Empty
        .set('AaAa', 'value1')
        .set('BBBB', 'value2')
        .set('AaBB', 'value3')

      expect(map.get('AaAa')).to.equal('value1');
      expect(map.get('BBBB')).to.equal('value2');
      expect(map.get('AaBB')).to.equal('value3');
    });

    it('should leave only last value of two different values with equal keys', function() {
      var map = Map.Empty.set('key', 'value1').set('key', 'value2');

      expect(map.get('key')).to.equal('value2');
    });
  });

  describe('#has', function() {
    it('should return false on empty map', function() {
      expect(Map.Empty.has('key')).to.be.false;
    });

    it('should return true if key is present', function() {
      var map = Map.Empty.set('key', 'value');
      expect(map.has('key')).to.be.true;
    });

    it('should return false if key is missing', function() {
      var map = Map.Empty.set('key', 'value');
      expect(map.has('missing')).to.be.false;
    });

    it('should work on "falsy" values', function() {
      var map = Map.Empty
        .set('zero', 0)
        .set('emptyString', '')
        .set('false', false)
        .set('null', null)
        .set('undefined', undefined)

      expect(map.has('zero')).to.be.true;
      expect(map.has('emptyString')).to.be.true;
      expect(map.has('false')).to.be.true;
      expect(map.has('null')).to.be.true;
      expect(map.has('undefined')).to.be.true;
    })
  });

  describe('#delete', function() {
    it('should work on empty map', function() {
      expect(Map.Empty.delete('missing')).to.equal(Map.Empty);
    });

    it('should return Map.Empty if map contains only one item', function() {
      expect(Map.Empty.set('key', 'value').delete('key')).to.equal(Map.Empty);
    });

    it('should return this map if key is missing', function() {
      expect(Map.Empty.delete('missing')).to.equal(Map.Empty);

      var m = Map.Empty.set('key', 'value');
      expect(m.delete('missing')).to.equal(m);
    });

    it('should return map without deleted value if key is present', function() {
      var m1 = Map.Empty.set('key', 'value');
      var m2 = m1.delete('key');
      expect(m2.has('key')).to.be.false;
    });

    it('should work on multi-element map', function() {
      var m1 = Map.Empty
        .set('key1', 'value1')
        .set('key2', 'value2')
        .set('key3', 'value3')

      var m2 = m1.delete('key2');

      expect(m2.has('key2')).to.be.false;
      expect(m2.get('key1')).to.equal('value1');
      expect(m2.get('key3')).to.equal('value3');
    });
  });

  describe('#reduce', function () {
    before(function () {
      this.numbers = [];
      for (var i = 0; i < 100; i++) {
        this.numbers.push(i);
      }
    });

    it('can calculate count', function () {
      var map = this.numbers.reduce(function (acc, n) {
        return acc.set(n, n);
      }, Map.Empty);

      expect(map.reduce(inc, 0)).to.equals(this.numbers.length);
    });

    it('can calculate sum', function () {
      var map = this.numbers.reduce(function (acc, n) {
        return acc.set(n, n);
      }, Map.Empty);

      expect(map.reduce(add, 0)).to.equals(this.numbers.reduce(add, 0));
    });

    it('can make a new map with incremented values', function () {
      var map = this.numbers.reduce(function (acc, n) {
        return acc.set(n, n);
      }, Map.Empty);

      function makeNode(tree, n) {
        return tree.set(n + 1, n + 1);
      }

      var incMap = map.reduce(makeNode, Map.Empty);

      expect(incMap.reduce(add, 0)).to.equals(this.numbers.map(inc).reduce(add, 0));
      expect(this.numbers.every(function (n) {
        return incMap.has(n + 1);
      })).to.be.true;
    });
  });
});