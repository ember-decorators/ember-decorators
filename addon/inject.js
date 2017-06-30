import Ember from 'ember';
import { decoratorWithKeyReflection } from './utils/decorator-macros';

/**
 * Decorator that wraps `Ember.inject.service`
 *
 * Injects a service into the object as the decorated property
 *
 *  ```javascript
 * import Ember from 'ember';
 * import { service } from 'ember-computed-decorators/inject';
 *
 * export default Ember.Component.extend({
 *   @service store
 * });
 * ```
 *
 * @function
 * @param {String} [serviceName] - The name of the service to inject. If not provided, the property name will be used
 */
export const service = decoratorWithKeyReflection(Ember.inject.service);

/**
 * Decorator that wraps `Ember.inject.controller`
 *
 * Injects a controller into a Controller as the decorated property
 *
 *  ```javascript
 * import Ember from 'ember';
 * import { service } from 'ember-computed-decorators/inject';
 *
 * export default Ember.Controller.extend({
 *   @controller application
 * });
 * ```
 *
 * @function
 * @param {String} [controllerName] - The name of the controller to inject. If not provided, the property name will be used
 */
export const controller = decoratorWithKeyReflection(Ember.inject.controller);
