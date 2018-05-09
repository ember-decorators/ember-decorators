import DS, { ModelRegistry, TransformRegistry } from "ember-data";

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
 */
export function attr(): PropertyDecorator;
/**
 * Decorator that turns the property into an Ember Data attribute
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { attr } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @attr('string') firstName: null,
 *   @attr('boolean', { allowNull: true }) isCool: null
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the attribute
 * @param {Object} [options] - Optional attribute options
 */
export function attr<K extends keyof TransformRegistry>(
  type: K,
  options?: DS.AttrOptions<TransformRegistry[K]>
): PropertyDecorator;

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
 */
export function hasMany(): PropertyDecorator;
/**
 * Decorator that turns the property into an Ember Data `hasMany` relationship
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { hasMany } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @hasMany('user') users: null,
 *   @hasMany('car', { async: false }) cars: null
 * });
 * ```
 *
 * @function
 * @param {String} [type] - Type of the `hasMany` relationship
 * @param {Object} [options] - Optional relationship options
 */
export function hasMany<K extends keyof ModelRegistry>(
  type: K,
  options?: DS.RelationshipOptions<ModelRegistry[K]>
): PropertyDecorator;

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
 */
export function belongsTo(): PropertyDecorator;
/**
 * Decorator that turns the property into an Ember Data `belongsTo` relationship
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { belongsTo } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @belongsTo('user') user: null,
 *   @belongsTo('car', { async: false }) car: null
 * });
 * ```
 * @function
 * @param {String} [type] - Type of the `belongsTo` relationship
 * @param {Object} [options] - Optional relationship options
 */
export function belongsTo<K extends keyof ModelRegistry>(
  type: K,
  options?: DS.RelationshipOptions<ModelRegistry[K]>
): PropertyDecorator;
