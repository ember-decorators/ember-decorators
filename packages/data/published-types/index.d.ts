// TypeScript Version: 2.8

import EmberArray from '@ember/array';
import ComputedProperty from '@ember/object/computed';

import DS from 'ember-data';
import TransformRegistry from 'ember-data/types/registries/transform';
import ModelRegistry from 'ember-data/types/registries/model';

type ComputedDecorator<Get, Set = Get> = ComputedProperty<Get, Set> & PropertyDecorator;

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
export const attr: {
  <K extends keyof TransformRegistry>(
    type: K,
    options?: DS.AttrOptions<TransformRegistry[K]>
  ): ComputedDecorator<TransformRegistry[K]>;

  (options?: DS.AttrOptions): ComputedDecorator<any>;

  (target: object, propertyKey: string | symbol): void;
}

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
export const hasMany: {
  <K extends keyof ModelRegistry>(
    type: K,
    options: DS.RelationshipOptions<ModelRegistry[K]> & DS.Sync
  ): ComputedDecorator<DS.ManyArray<ModelRegistry[K]>>;

  <K extends keyof ModelRegistry>(
    type: K,
    options?: DS.RelationshipOptions<ModelRegistry[K]> & DS.Async
  ): ComputedDecorator<
    DS.PromiseManyArray<ModelRegistry[K]>,
    EmberArray<ModelRegistry[K]>
  >;

  (target: object, propertyKey: string | symbol): void;
}

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
export const belongsTo: {
  <K extends keyof ModelRegistry>(
    modelName: K,
    options: DS.RelationshipOptions<ModelRegistry[K]> & DS.Sync
  ): ComputedDecorator<ModelRegistry[K]>;

  <K extends keyof ModelRegistry>(
    modelName: K,
    options?: DS.RelationshipOptions<ModelRegistry[K]> & DS.Async
  ): ComputedDecorator<
    ModelRegistry[K] & DS.PromiseObject<ModelRegistry[K]>,
    ModelRegistry[K]
  >;

  (target: object, propertyKey: string | symbol): void;
}

// Prevent automatic exports of internal types
export {}
