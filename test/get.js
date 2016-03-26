
var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;

var JsonLoc = require('../jsonloc.js');

describe('Get', function() {
  it('can get root property value', function() {
    var object = {
      test: 'Lorem Ipsum'
    };
    var value = JsonLoc.get(object, 'test');
    expect(value).to.equal(object.test);
  });

  it('will return null when property does not exist', function() {
    var object = {
      test: 'Lorem Ipsum'
    };
    var value = JsonLoc.get(object, 'another');
    expect(value).to.equal(null);
  });
  
  it('can get second level property value', function() {
    var object = {
      first: {
        second: 'Lorem'
      }
    };
    var value = JsonLoc.get(object, 'first.second');
    expect(value).to.equal(object.first.second);
  });
  
  it('can get root property with empty name', function() {
    var object = {
      '': {
        name: 'Alice',
      },
      name: 'Bob'
    };
    var value = JsonLoc.get(object, '.name');
    expect(value).to.equal('Alice');
  });
  
  it('can get index value', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    var value = JsonLoc.get(object, 'items[0]');
    expect(value).to.equal(object.items[0]);
  });
  
  it('can get last item from array', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    var value = JsonLoc.get(object, 'items[last]');
    expect(value).to.equal(object.items[2]);
  });
  
  it('will return null when index does not exists', function() {
    var object = {
      items: ['first', 'second', 'thirth']
    };
    var value = JsonLoc.get(object, 'items[10]');
    expect(value).to.equal(null);
  });
  
  it('will return null for last item of empty array', function() {
    var object = {
      items: []
    };
    var value = JsonLoc.get(object, 'items[last]');
    expect(value).to.equal(null);
  });
  
  it('will reject [] for get operations', function() {
    expect(function() {
      JsonLoc.get({items: []}, 'items[]');
    }).to.throw(Error);
  });
  
  it('will reject invalid index', function() {
    expect(function() {
      JsonLoc.get({items: []}, 'items[invalid]');
    }).to.throw(Error);
  });
  
  it('will reject array index on objects', function() {
    expect(function() {
      JsonLoc.get({items: {}}, 'items[0]');
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
    var value = JsonLoc.get(object, 'users[0].age');
    expect(value).to.equal(29);
  });
  
  it('will return when using unexisting properties in path', function() {
    var object = {};
    var value = JsonLoc.get(object, 'first.second.thirth');
    expect(value).to.equal(null);
  });
  
  it('cannot get value from empty location', function() {
    expect(function() {
      JsonLoc.get({}, '');
    }).to.throw(Error);
  });
});
