import Ember from 'ember';
import computed from 'ember-macro-helpers/computed';

import extractValue from './utils/extract-value';
import {
  decorator,
  decoratorWithParams
} from './utils/decorator-wrappers';

import {
  decoratorWithRequiredParams,
  decoratedPropertyWithRequiredParams
} from './utils/decorator-macros';


export default decoratorWithParams(function(target, key, desc, params) {
  if (!desc.writable) {
    throw new Error('ember-computed-decorators does not support using getters and setters');
  }

  let value = extractValue(desc);
  return computed(...params, value);
});

export const readOnly = decorator(function(target, name, desc) {
  var value = extractValue(desc);
  return value.readOnly();
});

export const on = decoratorWithRequiredParams(Ember.on, 'Cannot `on` without event names');
export const observes = decoratorWithRequiredParams(Ember.observer, 'Cannot `observe` without property names');

export const alias = decoratedPropertyWithRequiredParams(Ember.computed.alias, 'Cannot use `alias` without parameters');
export const and = decoratedPropertyWithRequiredParams(Ember.computed.and, 'Cannot use `and` without parameters');
export const bool = decoratedPropertyWithRequiredParams(Ember.computed.bool, 'Cannot use `bool` without parameters');
export const collect = decoratedPropertyWithRequiredParams(Ember.computed.collect, 'Cannot use `collect` without parameters');
export const empty = decoratedPropertyWithRequiredParams(Ember.computed.empty, 'Cannot use `empty` without parameters');
export const equal = decoratedPropertyWithRequiredParams(Ember.computed.equal, 'Cannot use `equal` without parameters');
export const filter = decoratedPropertyWithRequiredParams(Ember.computed.filter, 'Cannot use `filter` without parameters');
export const filterBy = decoratedPropertyWithRequiredParams(Ember.computed.filterBy, 'Cannot use `filterBy` without parameters');
export const gt = decoratedPropertyWithRequiredParams(Ember.computed.gt, 'Cannot use `gt` without parameters');
export const gte = decoratedPropertyWithRequiredParams(Ember.computed.gte, 'Cannot use `gte` without parameters');
export const intersect = decoratedPropertyWithRequiredParams(Ember.computed.intersect, 'Cannot use `intersect` without parameters');
export const lt = decoratedPropertyWithRequiredParams(Ember.computed.lt, 'Cannot use `lt` without parameters');
export const lte = decoratedPropertyWithRequiredParams(Ember.computed.lte, 'Cannot use `lte` without parameters');
export const map = decoratedPropertyWithRequiredParams(Ember.computed.map, 'Cannot use `map` without parameters');
export const mapBy = decoratedPropertyWithRequiredParams(Ember.computed.mapBy, 'Cannot use `mapBy` without parameters');
export const match = decoratedPropertyWithRequiredParams(Ember.computed.match, 'Cannot use `match` without parameters');
export const max = decoratedPropertyWithRequiredParams(Ember.computed.max, 'Cannot use `max` without parameters');
export const min = decoratedPropertyWithRequiredParams(Ember.computed.min, 'Cannot use `min` without parameters');
export const none = decoratedPropertyWithRequiredParams(Ember.computed.none, 'Cannot use `none` without parameters');
export const not = decoratedPropertyWithRequiredParams(Ember.computed.not, 'Cannot use `not` without parameters');
export const notEmpty = decoratedPropertyWithRequiredParams(Ember.computed.notEmpty, 'Cannot use `notEmpty` without parameters');
export const oneWay = decoratedPropertyWithRequiredParams(Ember.computed.oneWay, 'Cannot use `oneWay` without parameters');
export const or = decoratedPropertyWithRequiredParams(Ember.computed.or, 'Cannot use `or` without parameters');
export const reads = decoratedPropertyWithRequiredParams(Ember.computed.reads, 'Cannot use `reads` without parameters');
export const setDiff = decoratedPropertyWithRequiredParams(Ember.computed.setDiff, 'Cannot use `setDiff` without parameters');
export const sort = decoratedPropertyWithRequiredParams(Ember.computed.sort, 'Cannot use `sort` without parameters');
export const sum = decoratedPropertyWithRequiredParams(Ember.computed.sum, 'Cannot use `sum` without parameters');
export const union = decoratedPropertyWithRequiredParams(Ember.computed.union, 'Cannot use `union` without parameters');
export const uniq = decoratedPropertyWithRequiredParams(Ember.computed.uniq, 'Cannot use `uniq` without parameters');
