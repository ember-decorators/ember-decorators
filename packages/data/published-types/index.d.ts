// TypeScript Version: 2.8

import DS from 'ember-data';
import TransformRegistry from 'ember-data/types/registries/transform';
import ModelRegistry from 'ember-data/types/registries/model';

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
export function attr(target: object, propertyKey: string | symbol): void;
/**
 * Decorator that turns the property into an Ember Data attribute
 *
 * ```javascript
 * import Model from 'ember-data/model';
 * import { attr } from 'ember-decorators/data';
 *
 * export default Model.extend({
 *   @attr({ defaultValue: () => [] }) personalItems;
 * });
 * ```
 *
 * @function
 * @param {Object} [options] - Optional attribute options
 */
// tslint:disable-next-line:unified-signatures
export function attr(options?: DS.AttrOptions): PropertyDecorator;
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
export function hasMany(target: object, propertyKey: string | symbol): void;
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
export function belongsTo(target: object, propertyKey: string | symbol): void;
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
