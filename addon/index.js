import Ember from 'ember';

const { get } = Ember;

import computed from 'ember-new-computed';

function handleDescriptor(target, key, desc, params = []) {
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
  return function(value) {
    let paramValues = params.map(p => get(this, p));
    paramValues.unshift(value);

    return func.apply(this, paramValues);
  };
}

function isDescriptor(item) {
  return item && typeof item === 'object';
}

export default function computedDecorator(...params) {
  // determine if user called as @computed('blah', 'blah') or @computed
  if (isDescriptor(params[params.length - 1])) {
    return handleDescriptor(...arguments);
  } else {
    return function(/* target, key, desc */) {
      return handleDescriptor(...arguments, params);
    };
  }
}

export function readOnly(target, name, desc) {
  return {
    writable:     false,
    enumerable:   desc.enumerable,
    configurable: desc.configurable,
    initializer:  function() {
      return desc.initializer().readOnly();
    }
  };
}

function decoratorAlias(fn, errorMessage) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (params.length === 0) {
      throw new Error(errorMessage);
    } else {
      return function(target, key, desc) {
        return {
          enumerable: desc.enumerable,
          configurable: desc.configurable,
          writalbe: desc.writable,
          initializer: function() {
            return fn.apply(null, params.concat(desc.initializer()));
          }
        };
      };
    }
  };
}

export var on = decoratorAlias(Ember.on, 'Can not `on` without event names');
export var observes = decoratorAlias(Ember.observer, 'Can not `observe` without property names');

function macroAlias(fn) {
  return function(...params) {
    return function(target, propertyName, desc) {
      return {
        enumerable: desc.enumerable,
        configurable: desc.configurable,
        writable: desc.writable,
        initializer: function() {
          return fn(...params);
        }
      };
    };
  };
}

export var alias = macroAlias(Ember.computed.alias);
export var empty = macroAlias(Ember.computed.empty);
export var notEmpty = macroAlias(Ember.computed.notEmpty);
export var none = macroAlias(Ember.computed.none);
export var not = macroAlias(Ember.computed.not);
export var bool = macroAlias(Ember.computed.bool);
export var match = macroAlias(Ember.computed.match);
export var equal = macroAlias(Ember.computed.equal);
export var gt = macroAlias(Ember.computed.gt);
export var gte = macroAlias(Ember.computed.gte);
export var lt = macroAlias(Ember.computed.lt);
export var lte = macroAlias(Ember.computed.lte);
export var and = macroAlias(Ember.computed.and);
export var or = macroAlias(Ember.computed.or);
export var any = macroAlias(Ember.computed.any);
export var collect = macroAlias(Ember.computed.collect);
export var oneWay = macroAlias(Ember.computed.oneWay);
