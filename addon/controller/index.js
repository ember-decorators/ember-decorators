import Ember from 'ember';
import { decoratorWithKeyReflection } from '../utils/decorator-macros';

/**
 * Decorator that wraps `Ember.inject.controller`
 *
 * Injects a controller into a Controller as the decorated property
 *
 *  ```javascript
 * import Controller from '@ember/controller';
 * import { controller } from 'ember-decorators/controller';
 *
 * export default class IndexController extends Controller {
 *   @controller application;
 * }
 * ```
 *
 * @function
 * @param {String} [controllerName] - The name of the controller to inject. If not provided, the property name will be used
 */
export const controller = decoratorWithKeyReflection(Ember.inject.controller);
