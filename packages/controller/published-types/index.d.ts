// TypeScript Version: 2.8

import { Registry } from '@ember/controller';
import ComputedProperty from '@ember/object/computed';

type ComputedDecorator<Get, Set = Get> = ComputedProperty<Get, Set> & PropertyDecorator;

/**
 * Decorator that wraps `Ember.inject.controller`
 *
 * Injects a controller into a Controller as the decorated property
 *
 *  ```javascript
 * import Controller from '@ember/controller';
 * import { inject as controller } from 'ember-decorators/controller';
 *
 * export default class IndexController extends Controller {
 *   @controller() application;
 * }
 * ```
 *
 * @function
 * @param {String} [controllerName] - The name of the controller to inject. If not provided, the property name will be used
 */
export const inject: {
  <K extends keyof Registry>(name?: K): ComputedDecorator<Registry[K]>;
} & PropertyDecorator;

// Prevent automatic exports of internal types
export {}
