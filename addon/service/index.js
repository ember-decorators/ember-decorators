import Ember from 'ember';
import { decoratorWithKeyReflection } from '../utils/decorator-macros';

/**
 * Decorator that wraps `Ember.inject.service`
 *
 * Injects a service into the object as the decorated property
 *
 *  ```javascript
 * import Component from '@ember/component';
 * import { service } from 'ember-decorators/service';
 *
 * export default class StoreInjectedComponent extends Component
 *   @service store;
 * }
 * ```
 *
 * @function
 * @param {String} [serviceName] - The name of the service to inject. If not provided, the property name will be used
 */
export const service = decoratorWithKeyReflection(Ember.inject.service);
