import DS from 'ember-data';
import { decoratorWithKeyReflection } from './utils/decorator-macros';

/**
 * Decorator that turns the property into an Ember Data attribute
 *
 * ```javascript
 * import DS from 'ember-data';
 * import { attr } from "ember-computed-decorators/ember-data";
 *
 * export default DS.Model.extend({
 *   @attr firstName
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the attribute
 */
export const attr = decoratorWithKeyReflection(DS.attr);

/**
 * Decorator that turns the property into an Ember Data `hasMany` relationship
 *
 * ```javascript
 * import DS from 'ember-data';
 * import { hasMany } from "ember-computed-decorators/ember-data";
 *
 * export default DS.Model.extend({
 *   @hasMany users
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the `hasMany` relationship
 */
export const hasMany = decoratorWithKeyReflection(DS.hasMany);

/**
 * Decorator that turns the property into an Ember Data `belongsTo` relationship
 *
 * ```javascript
 * import DS from 'ember-data';
 * import { belongsTo } from "ember-computed-decorators/ember-data";
 *
 * export default DS.Model.extend({
 *   @belongsTo user
 * });
 * ```
 * @function
 * @param {String} [type] - Type of the `belongsTo` relationship
 */
export const belongsTo = decoratorWithKeyReflection(DS.belongsTo);
