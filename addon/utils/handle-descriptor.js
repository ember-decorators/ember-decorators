import Ember from 'ember';
import extractValue from './extract-value';

const { computed, expandProperties, get } = Ember;

export default function handleDescriptor(target, key, desc, params = []) {
  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writeable: desc.writeable,
    initializer: function() {
      let computedDescriptor;

      if (desc.writable) {
        var val = extractValue(desc);
        if (typeof val === 'object') {
          let value = { };
          if (val.get) { value.get = callUserSuppliedGet(params, val.get); }
          if (val.set) { value.set = callUserSuppliedSet(params, val.set); }
          computedDescriptor = value;
        } else {
          computedDescriptor = callUserSuppliedGet(params, val);
        }
      } else {
        throw new Error('ember-computed-decorators does not support using getters and setters');
      }

      return computed.apply(null, params.concat(computedDescriptor));
    }
  };
}

function expandPropertyList(propertyList) {
  return propertyList.reduce((newPropertyList, property) => {
    const atEachIndex = property.indexOf('.@each');
    if (atEachIndex !== -1) {
      return newPropertyList.concat(property.slice(0, atEachIndex));
    } else if (property.slice(-2) === '[]') {
      return newPropertyList.concat(property.slice(0, -3));
    }

    expandProperties(property, (expandedProperties) => {
      newPropertyList = newPropertyList.concat(expandedProperties);
    });

    return newPropertyList;
  }, []);
}

function callUserSuppliedGet(params, func) {
  const expandedParams = expandPropertyList(params);
  return function() {
    let paramValues = expandedParams.map(p => get(this, p));

    return func.apply(this, paramValues);
  };
}


function callUserSuppliedSet(params, func) {
  const expandedParams = expandPropertyList(params);
  return function(key, value) {
    let paramValues = expandedParams.map(p => get(this, p));
    paramValues.unshift(value);

    return func.apply(this, paramValues);
  };
}

