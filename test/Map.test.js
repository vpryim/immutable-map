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