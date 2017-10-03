import { DEBUG } from '@glimmer/env';

import Ember from 'ember';
import macroComputed from 'ember-macro-helpers/computed';

import collapseProto from '../utils/collapse-proto';
import extractValue from '../utils/extract-value';
import {
  decorator,
  decoratorWithParams
} from '../utils/decorator-wrappers';

import { decoratorWithRequiredParams } from '../utils/decorator-macros';

import { assert } from '@ember/debug';
import {
  HAS_UNDERSCORE_ACTIONS,
  SUPPORTS_NEW_COMPUTED
} from 'ember-compatibility-helpers';

const { computed: emberComputed } = Ember;

/**
 * Decorator that turns the target function into an Action
 *
 * Adds an `actions` object to the target object and creates a passthrough
 * function that calls the original. This means the function still exists
 * on the original object, and can be used directly.
 *
 * ```js
 * import Component from '@ember/component';
 * import { action } from 'ember-decorators/object';
 *
 * export default class ActionDemoComponent extends Component {
 *   @action
 *   foo() {
 *     // do something
 *   }
 * }
 * ```
 *
 * ```hbs
 * <button onclick={{action "foo"}}>Execute foo action</button>
 * ```
 *
 * @function
 */
export const action = decorator(function(target, key, desc) {
  let value = extractValue(desc);

  assert('The @action decorator must be applied to functions', typeof value === 'function');

  collapseProto(target);

  if (HAS_UNDERSCORE_ACTIONS) {
    if (!target.hasOwnProperty('_actions')) {
      let parentActions = target._actions;
      target._actions = parentActions ? Object.create(parentActions) : {};
    }

    target._actions[key] = value;
  } else {
    if (!target.hasOwnProperty('actions')) {
      let parentActions = target.actions;
      target.actions = parentActions ? Object.create(parentActions) : {};
    }

    target.actions[key] = value;
  }

  return value;
});

/**
 * Decorator that turns a function into a computed property.
 *
 * #### With Dependent Keys
 *
 * The values of the dependent properties are passed as arguments to the
 * function. You can also use
 * [property brace expansion](https://www.emberjs.com/blog/2014/02/12/ember-1-4-0-and-ember-1-5-0-beta-released.html#toc_property-brace-expansion).
 *
 * ```javascript
 * import EmberObject from '@ember/object';
 * import computed from 'ember-decorators/object';
 *
 * export default class User extends EmberObject {
 *   someKey = 'foo';
 *   otherKey = 'bar';
 *
 *   person = {
 *     firstName: 'John',
 *     lastName: 'Smith'
 *   };
 *
 *   @computed('someKey', 'otherKey')
 *   foo(someKey, otherKey) {
 *     return `${someKey} - ${otherKey}`; // => 'foo - bar'
 *   }
 *
 *   @computed('person.{firstName,lastName}')
 *   fullName(firstName, lastName) {
 *     return `${firstName} ${lastName}`; // => 'John Smith'
 *   }
 * }
 * ```
 *
 * #### Without Dependent Keys
 *
 * Computed properties without dependent keys are cached for the whole life span
 * of the object. You can only force a recomputation by calling
 * [`notifyPropertyChange`](https://www.emberjs.com/api/ember/2.14/classes/Ember.Observable/methods/notifyPropertyChange?anchor=notifyPropertyChange)
 * on the computed property.
 *
 * ```javascript
 * import EmberObject from '@ember/object';
 * import computed from 'ember-decorators/object';
 *
 * export default class FooBar extends EmberObject {
 *   @computed
 *   foo() {
 *     // calculate stuff
 *     return stuff;
 *   }
 * }
 * ```
 *
 * #### Getter and Setter
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { setProperties } from ''@ember/object';
 * import computed from 'ember-decorators/object';
 *
 * export default class UserProfileComponent extends Component {
 *   first = 'John';
 *   last = 'Smith';
 *
 *   @computed('first', 'last')
 *   name = {
 *     get(first, last) {
 *       return `${first} ${last}`; // => 'John Smith'
 *     },
 *
 *     set(value, first, last) {
 *       if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
 *         throw new TypeError('Invalid name');
 *       }
 *
 *       const [first, last] = value.split(' ');
 *       setProperties(this, { first, last });
 *
 *       return value;
 *     }
 *   };
 * }
 * ```
 *
 * @function
 * @param {...String} propertyNames - List of property keys this computed is dependent on
 */
export const computed = decoratorWithParams(function(target, key, desc, params) {
  assert(`ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`, !(desc.value instanceof Ember.ComputedProperty));

  if (desc.writable === undefined) {
    let { get, set } = desc;

    assert(`Using @computed for only a setter does not make sense. Add a getter for '${key}' as well or remove the @computed decorator.`, typeof get === 'function');

    // Unset the getter and setter so the descriptor just has a plain value
    desc.get = undefined;
    desc.set = undefined;

    let setter;

    if (typeof set === 'function') {
      setter = function(key, value) {
        let ret = set.call(this, value);
        return typeof ret === 'undefined' ? get.call(this) : ret;
      };
    } else if (DEBUG) {
      setter = function() {
        assert(`You must provide a setter in order to set '${key}' as a computed property.`, false);
      };
    }

    // Use a standard ember computed since getter/setter arrity is restricted,
    // meaning ember-macro-helpers doesn't provide any benefit
    if (SUPPORTS_NEW_COMPUTED) {
      return emberComputed(...params, { get, set: setter });
    } else {
      let callback;

      if (typeof setter === 'function') {
        callback = function (key, value) {
          if (arguments.length > 1) {
            return setter.call(this, key, value);
          }

          return get.call(this);
        }
      } else {
        callback = get;
      }

      return emberComputed(...params, callback);
    }
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
 * import Component from '@ember/component';
 * import { observes } from 'ember-decorators/object';
 *
 * export default class extends Component {
 *   @observes('foo')
 *   bar() {
 *     //...
 *   }
 * }
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
 * import Component from '@ember/component';
 * import { computed, readOnly } from 'ember-decorators/object';
 *
 * export default class extends Component {
 *   @readOnly
 *   @computed('first', 'last')
 *   name(first, last) {
 *     return `${first} ${last}`;
 *   }
 * }
 * ```
 *
 * @function
 */
export const readOnly = decorator(function(target, name, desc) {
  var value = extractValue(desc);
  return value.readOnly();
});
