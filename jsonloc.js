
/**
 * Extract parts from query.
 * 
 * @private
 * @method extractParts
 * @param {string} location
 * @returns {Array}
 */
var extractParts = function(location) {
  if (location === '' || typeof location !== 'string') {
    throw Error('Invalid JSON location');
  }
  var parts = location.split(/(\.|\[[^\]]*\])/).filter(function(part) {
    if (part[0] === '[' && !part.match(/^\[(?:last||[0-9]*)\]$/)) {
      throw Error('Invalid array index: ' + part);
    }
    return part && part !== '.';
  });
  if (location[0] === '.') {
    // The query may start with a dota, which indicates an object with empty name.
    parts.unshift(['']);
  }
  return parts.map(function(part) {
    return part[0] === '[' ? {
      type: 'array',
      value: part === '[last]' ? -2 : (part === '[]' ? -1 : parseInt(part.replace(/^.(.*).$/, '$1'), 10))
    } : {
      type: 'property',
      value: part
    };
  });
};

/**
 * Execute query on object, and return matched part or manipulated object.
 * 
 * The action can be "get", "set" or "del". When "get" is used, the part that
 * matched the query is returned. The manupulated object is returned when using
 * "set" or "del". The value is the new value for the "set" action.
 * 
 * @private
 * @method execute
 * @param {object} object
 * @param {string} location
 * @param {string} action
 * @param {mixed} value
 * @returns {object}
 */
var execute = function(object, location, action, value) {
  var ref = object;
  var parts = extractParts(location);
  
  // Store a reference to the parent object. We need this for array manipulation.
  var parent;
  var parentProperty;
  
  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i];
    if (typeof ref === 'undefined') {
      return null;
    }
    
    // Do array index handling when hitting an array.
    if (part.type === 'array') {
      if (!(ref instanceof Array)) {
        throw Error('Cannot access array index on non-array');
      }
      if (part.value === -2) {
        part.value = ref.length - 1;
      }
      if (part.value === -1) {
        ref.push(undefined);
        part.value = ref.length - 1;
      }
    }
    
    // If this is the last part, execute the action.
    if (i === parts.length - 1) {
      switch (action) {
        case 'get':
          return typeof ref[part.value] === 'undefined' ? null : ref[part.value];
        case 'set':
          ref[part.value] = value;
          break;
        case 'del':
          if (ref instanceof Array) {
            parent[parentProperty] = filterIndex(ref, part.value);
          }
          else {
            delete ref[part.value];
          }
      }
    }
    else {
      parent = ref;
      parentProperty = part.value;
      ref = ref[part.value];
    }
  }
};

/**
 * Remove item from array with specified index.
 * 
 * @private
 * @method filterIndex
 * @param {Array} array
 * @param {number} index
 * @returns {Array}
 */
var filterIndex = function(array, index) {
  return array.filter(function(item, idx) {
    return idx !== index;
  });
};

/**
 * Get the value that matches the location query.
 * 
 * @method get
 * @param {object} object
 * @param {string} location
 * @returns {mixed}
 */
var get = function(object, location) {
  var value = null;
  if (location.indexOf('[]') >= 0) {
    throw Error('Cannot use [] operator for get operations');
  }
  return execute(object, location, 'get');
};

/**
 * Insert or update the property that matches the location query.
 * The manipulated object will be returned.
 * 
 * @method set
 * @param {object} object
 * @param {string} location
 * @param {mixed} value
 * @returns {object}
 */
var set = function(object, location, value) {
  // Clone the object first to avoid manipulating the referenced object.
  object = JSON.parse(JSON.stringify(object));
  execute(object, location, 'set', value);
  return object;
};

/**
 * Delete the property that matches the location query.
 * The manipulated object will be returned.
 * 
 * @method set
 * @param {object} object
 * @param {string} location
 * @returns {object}
 */
var del = function(object, location) {
  // Clone the object first to avoid manipulating the referenced object.
  object = JSON.parse(JSON.stringify(object));
  execute(object, location, 'del');
  return object;
};

exports.get = get;
exports.set = set;
exports.del = del;
