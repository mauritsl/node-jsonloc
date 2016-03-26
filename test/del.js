
var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;

var JsonLoc = require('../jsonloc.js');

describe('Del', function() {
  it('can delete root property', function() {
    var object = {
      test: 'Lorem Ipsum'
    };
    object = JsonLoc.del(object, 'test');
    expect(object).to.deep.equal({});
  });

  it('can delete second level property', function() {
    var object = {
      first: {
        second: 'Lorem'
      }
    };
    object = JsonLoc.del(object, 'first.second');
    expect(object).to.deep.equal({first:{}});
  });
  
  it('can delete index value', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    object = JsonLoc.del(object, 'items[0]');
    expect(object.items).to.deep.equal(['second', 'thirth']);
  });
  
  it('does not affect object when deleting non-existing property', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    object = JsonLoc.del(object, 'test');
    expect(object).to.deep.equal(object);
  });
  
  it('does not affect original object', function() {
    var object = {
      foo: 'bar'
    };
    var clone = JSON.parse(JSON.stringify(object));
    JsonLoc.del(object, 'foo');
    expect(object).to.deep.equal(clone);
  });
});
