JSONLoc
==================

[![Build Status](https://travis-ci.org/mauritsl/node-jsonloc.svg?branch=master)](https://travis-ci.org/mauritsl/node-jsonloc)
[![Dependency Status](https://david-dm.org/mauritsl/node-jsonloc.svg)](https://david-dm.org/mauritsl/node-jsonloc)

Manipulate JSON/JavaScript objects using simple location queries.

## Installation

Install using ``npm install jsonloc``

## Quick example

```javascript
var JsonLoc = require('jsonloc');
var object = {
  users: [{
    name: 'Alice',
    age: 28
  }, {
    name: 'Bob',
    age: 29
  }]
};

object = JsonLoc.set(object, 'names', []);
object = JsonLoc.set(object, 'names[]', JsonLoc.get(object, 'users[0].name'));
object = JsonLoc.set(object, 'names[]', JsonLoc.get(object, 'users[last].name'));
object = JsonLoc.del(object, 'users');

console.log(object);
// { names: [ 'Alice', 'Bob' ] }
```
