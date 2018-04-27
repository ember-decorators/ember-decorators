import DS from 'ember-data';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

function computedDecoratorWithKeyReflection(fn) {
  return computedDecoratorWithParams(function(target, keyName, desc, params) {
    let key;

    if (typeof params[0] === 'string') {
      key = params.shift();
    } else {
      key = keyName;
    }

    return fn(key, ...params)
  });
}


/**
 * Decorator that turns the property into an Ember Data attribute
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { attr } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @attr firstName: null
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the attribute
 */
export const attr = computedDecoratorWithParams(function(target, key, desc, params) {
  return DS.attr(...params);
});

/**
 * Decorator that turns the property into an Ember Data `hasMany` relationship
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { hasMany } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @hasMany users: null
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the `hasMany` relationship
 */
export const hasMany = computedDecoratorWithKeyReflection(DS.hasMany);

/**
 * Decorator that turns the property into an Ember Data `belongsTo` relationship
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { belongsTo } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @belongsTo user: null
 * });
 * ```
 * @function
 * @param {String} [type] - Type of the `belongsTo` relationship
 */
export const belongsTo = computedDecoratorWithKeyReflection(DS.belongsTo);
