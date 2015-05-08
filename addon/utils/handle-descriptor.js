import Ember from 'ember';
import computed from 'ember-new-computed';

const { get } = Ember;

export default function handleDescriptor(target, key, desc, params = []) {
  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writeable: desc.writeable,
    initializer: function() {
      let computedDescriptor;

      if (desc.writable) {
        var val = desc.initializer();
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

function callUserSuppliedGet(params, func) {
  return function() {
    let paramValues = params.map(p => get(this, p));

    return func.apply(this, paramValues);
  };
}


function callUserSuppliedSet(params, func) {
  return function(key, value) {
    let paramValues = params.map(p => get(this, p));
    paramValues.unshift(value);

    return func.apply(this, paramValues);
  };
}

