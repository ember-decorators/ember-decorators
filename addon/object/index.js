import Ember from 'ember';
import macroComputed from 'ember-macro-helpers/computed';

import extractValue from '../utils/extract-value';
import {
  decorator,
  decoratorWithParams
} from '../utils/decorator-wrappers';

import { decoratorWithRequiredParams } from '../utils/decorator-macros';

import { assert } from '@ember/debug';

const { computed: emberComputed } = Ember;

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
  let value = extractValue(desc);

  assert('The @action decorator must be applied to functions', typeof value === 'function');

  // We must collapse the superclass prototype to make sure that the `actions`
  // object will exist. Since collapsing doesn't generally happen until a class is
  // instantiated, we have to do it manually.
  let superClass = Object.getPrototypeOf(target.constructor);

  if (superClass.hasOwnProperty('proto') && typeof superClass.proto === 'function') {
    superClass.proto();
  }

  if (!target.hasOwnProperty('actions')) {
    let parentActions = target.actions;
    target.actions = parentActions ? Object.create(parentActions) : {};
  }

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
  assert(`ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`, !(desc.value instanceof Ember.ComputedProperty));

  if (desc.writable === undefined) {
    let { get, set } = desc;

    // Unset the getter and setter so the descriptor just has a plain value
    desc.get = undefined;
    desc.set = undefined;

    // Use a standard ember computed since getter/setter arrity is restricted,
    // meaning ember-macro-helpers doesn't provide any benefit
    return emberComputed(...params, {
      get,
      set(key, value) {
        return set.call(this, value);
      }
    });
  } else {
    return macroComputed(...params, extractValue(desc));
  }
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
export const observes = decoratorWithRequiredParams(Ember.observer);

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
