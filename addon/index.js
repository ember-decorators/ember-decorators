import Ember from 'ember';

import handleDescriptor from './utils/handle-descriptor';
import isDescriptor from './utils/is-descriptor';

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
      var value = desc.value || typeof desc.initializer === 'function' && desc.initializer();
      return value.readOnly();
    }
  };
}

import decoratorAlias from './decorator-alias';

export var on = decoratorAlias(Ember.on, 'Can not `on` without event names');
export var observes = decoratorAlias(Ember.observer, 'Can not `observe` without property names');

import macroAlias from './macro-alias';

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
