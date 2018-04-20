import { inject as injectController } from '@ember/controller';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

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
export const controller = computedDecoratorWithParams((target, key, desc, params) => {
  return params.length > 0 ? injectController(...params) : injectController(key);
});
