import Ember from 'ember';
import computedMacro from 'ember-macro-helpers/computed';

import extractValue from '../utils/extract-value';
import {
  decorator,
  decoratorWithParams
} from '../utils/decorator-wrappers';

import {
  decoratorWithRequiredParams
} from '../utils/decorator-macros';

/**
 * Decorator that turns the target function into an Action
 *
 * Adds an `actions` object to the target object and creates a passthrough
 * function that calls the original. This means the function still exists
 * on the original object, and can be used directly.
 *
 * Before:
 *
 * ```js
 * export default Ember.Component.extend({
 *   actions: {
 *     foo() {
 *       // do something
 *     }
 *   }
 * });
 * ```
 *
 * After:
 *
 * ```js
 * import { action } from 'ember-decorators/object';
 *
 * export default MyComponent extends Ember.Component {
 *   @action
 *   foo() {
 *     // do something
 *   }
 * }
 * ```
 *
 * @function
 */
export const action = decorator(function(target, key, desc) {
  const value = extractValue(desc);

  if (typeof value !== 'function') {
    throw new Error('The @action decorator must be applied to functions');
  }

  target.actions = target.actions || {};
  target.actions[key] = value;

  return value;
});

/**
 * Decorator that turns a function into a computed property.
 *
 * In your application where you would normally have:
 *
 * ```javascript
 * foo: Ember.computed('someKey', 'otherKey', function() {
 *   var someKey = this.get('someKey');
 *   var otherKey = this.get('otherKey');
 *
 *   // Do Stuff
 * })
 * ```
 *
 * You replace with this:
 *
 * ```javascript
 * import computed from 'ember-decorators/object';
 *
 * // ..... <snip> .....
 * @computed('someKey', 'otherKey')
 * foo(someKey, otherKey) {
 *   // Do Stuff
 * }
 * ```
 *
 * #### Without Dependent Keys
 *
 * ```javascript
 * foo: Ember.computed(function() {
 *   // Do Stuff
 * })
 * ```
 *
 * You replace with this:
 *
 * ```javascript
 * import computed from 'ember-decorators/object';
 *
 * // ..... <snip> .....
 * @computed
 * foo() {
 *   // Do Stuff
 * }
 * ```
 *
 * #### "Real World"
 *
 * ```javascript
 * import Ember from 'ember';
 * import computed from 'ember-decorators/object';
 *
 * export default Ember.Component.extend({
 *   @computed('first', 'last')
 *   name(first, last) {
 *     return `${first} ${last}`;
 *   }
 * });
 * ```
 *
 *
 * #### "Real World get/set syntax"
 *
 * ```javascript
 * import Ember from 'ember';
 * import computed from 'ember-decorators/object';
 *
 * export default Ember.Component.extend({
 *   @computed('first', 'last')
 *   name: {
 *     get(first, last) {
 *       return `${first} ${last}`;
 *     },
 *
 *     set(value, first, last) {
 *       // ...
 *     }
 *   }
 * });
 * ```
 *
 * @function
 * @param {...String} propertyNames - List of property keys this computed is dependent on
 */
export const computed = decoratorWithParams(function(target, key, desc, params) {
  if (!desc.writable) {
    throw new Error('ember-decorators does not support using getters and setters');
  }

  let value = extractValue(desc);
  return computedMacro(...params, value);
});

/**
 * Decorator that wraps [Ember.observer](https://emberjs.com/api/#method_observer)
 *
 * Triggers the target function when the dependent properties have changed
 *
 * ```javascript
 * import Ember from 'ember';
 * import { observes } from 'ember-decorators/object';
 *
 * export default Ember.Component.extend({
 *   @observes('foo')
 *   bar() {
 *     //...
 *   }
 * });
 * ```
 *
 * @function
 * @param {...String} eventNames - Names of the events that trigger the function
 */
export const observes = decoratorWithRequiredParams(Ember.observer, 'Cannot `observe` without property names');

/**
 * Decorator that modifies a computed property to be read only.
 *
 * Usage:
 *
 * ```javascript
 * import Ember from 'ember';
 * import { computed, readOnly } from 'ember-decorators/object';
 *
 * export default Ember.Component.extend({
 *   @readOnly
 *   @computed('first', 'last')
 *   name(first, last) {
 *     return `${first} ${last}`;
 *   }
 * });
 * ```
 *
 * @function
 */
export const readOnly = decorator(function(target, name, desc) {
  var value = extractValue(desc);
  return value.readOnly();
});
