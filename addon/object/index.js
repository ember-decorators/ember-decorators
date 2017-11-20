import { DEBUG } from '@glimmer/env';

import Ember from 'ember';
import macroComputed from 'ember-macro-helpers/computed';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import extractValue from '@ember-decorators/utils/extract-value';
import {
  decorator,
  decoratorWithParams
} from '@ember-decorators/utils/decorator-wrappers';

import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator-macros';

import { assert, deprecate } from '@ember/debug';
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
 * Decorator that turns a function into a computed property. The decorators should
 * be applied to native getter and setter functions. Note that though they use getters
 * and setters, you must still use the Ember `get`/`set` functions to get and set their
 * values.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class UserProfileComponent extends Component {
 *   first = 'John';
 *   last = 'Smith';
 *
 *   @computed('first', 'last')
 *   get name() {
 *     const first = this.get('first');
 *     const last = this.get('last');
 *
 *     return `${first} ${last}`; // => 'John Smith'
 *   }
 *
 *   set name(value) {
 *     if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
 *       throw new TypeError('Invalid name');
 *     }
 *
 *     const [first, last] = value.split(' ');
 *     this.setProperties({ first, last });
 *
 *     return value;
 *   }
 * }
 * ```
 *
 * @function
 * @param {...String} propertyNames - List of property keys this computed is dependent on
 */
export const computed = decoratorWithParams(function(target, key, desc, params) {
  assert(`ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`, !(desc.value instanceof Ember.ComputedProperty));

  if ('get' in desc || 'set' in desc) {
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
    deprecate(
      'using @computed with functions directly will be removed in future versions, using ES getter/setter functions instead',
      false,
      { until: '2.0.0', id: 'macro-computed-deprecated' }
    );
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
