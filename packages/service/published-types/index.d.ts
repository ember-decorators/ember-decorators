// TypeScript Version: 2.8

import { Registry } from '@ember/service';
import ComputedProperty from '@ember/object/computed';

type ComputedDecorator<Get, Set = Get> = ComputedProperty<Get, Set> & PropertyDecorator;

/**
 * Decorator that wraps `Ember.inject.service`
 *
 * Injects a service into the object as the decorated property
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { inject as service } from 'ember-decorators/service';
 *
 * export default class StoreInjectedComponent extends Component
 *   @service store;
 * }
 * ```
 *
 * @function
 * @param {String} [serviceName] - The name of the service to inject. If not provided, the property name will be used
 */
export const inject: {
  <K extends keyof Registry>(name?: K): ComputedDecorator<Registry[K]>;
} & PropertyDecorator;

// Prevent automatic exports of internal types
export {}
