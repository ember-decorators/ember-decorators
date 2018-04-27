import { inject as injectService } from '@ember/service';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

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
export const service = computedDecoratorWithParams((target, key, desc, params) => {
  return params.length > 0 ? injectService(...params) : injectService(key);
});
