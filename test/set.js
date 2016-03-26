
var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;

var JsonLoc = require('../jsonloc.js');

describe('Set', function() {
  it('can set root property value', function() {
    var object = {
      test: 'Lorem Ipsum'
    };
    object = JsonLoc.set(object, 'test', 'Dolor sit amet');
    expect(object.test).to.equal('Dolor sit amet');
  });

  it('can set second level property value', function() {
    var object = {
      first: {
        second: 'Lorem'
      }
    };
    object = JsonLoc.set(object, 'first.second', 'Dolor sit amet');
    expect(object.first.second).to.equal('Dolor sit amet');
  });
  
  it('can set index value', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    object = JsonLoc.set(object, 'items[0]', 'changed');
    expect(object.items).to.deep.equal(['changed', 'second', 'thirth']);
  });
  
  it('can set last item from array', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    object = JsonLoc.set(object, 'items[last]', 'changed');
    expect(object.items).to.deep.equal(['first', 'second', 'changed']);
  });
  
  it('can add new items to array', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    object = JsonLoc.set(object, 'items[]', 'fourth');
    expect(object.items).to.deep.equal(['first', 'second', 'thirth', 'fourth']);
  });
  
  it('will reject setting invalid index', function() {
    expect(function() {
      JsonLoc.set({items: []}, 'items[invalid]', 'test');
    }).to.throw(Error);
  });
  
  it('will reject setting array index on objects', function() {
    expect(function() {
      JsonLoc.set({items: {}}, 'items[0]', 'test');
    }).to.throw(Error);
  });
  
  it('can mix object and array structures', function() {
    var object = {
      users: [{
        name: 'Alice',
        age: 29
      }, {
        name: 'Bob',
        age: 33
      }]
    };
    object = JsonLoc.set(object, 'users[0].age', 30);
    expect(object.users[0].age).to.equal(30);
  });
  
  it('does not affect original object', function() {
    var object = {
      foo: 'bar'
    };
    var clone = JSON.parse(JSON.stringify(object));
    JsonLoc.set(object, 'foo', 'baz');
    expect(object).to.deep.equal(clone);
  });
});
