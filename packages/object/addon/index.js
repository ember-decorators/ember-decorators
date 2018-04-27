import { DEBUG } from '@glimmer/env';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import { computed as emberComputed } from '@ember-decorators/utils/compatibility';
import { computedDecorator, computedDecoratorWithParams } from '@ember-decorators/utils/computed';

import { assert } from '@ember/debug';
import { HAS_UNDERSCORE_ACTIONS } from 'ember-compatibility-helpers';

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
 */
export function action(target, key, desc) {
  assert('The @action decorator must be applied to functions', desc && typeof desc.value === 'function');

  collapseProto(target);

  if (HAS_UNDERSCORE_ACTIONS) {
    if (!target.hasOwnProperty('_actions')) {
      let parentActions = target._actions;
      target._actions = parentActions ? Object.create(parentActions) : {};
    }

    target._actions[key] = desc.value;
  } else {
    if (!target.hasOwnProperty('actions')) {
      let parentActions = target.actions;
      target.actions = parentActions ? Object.create(parentActions) : {};
    }

    target.actions[key] = desc.value;
  }

  return desc;
}

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
export const computed = computedDecoratorWithParams((target, key, desc, params) => {
  assert(`ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`, !desc.isDescriptor);
  assert(`Attempted to apply @computed to ${key}, but it is not a native accessor function. Try converting it to \`get ${key}()\``, 'get' in desc || 'set' in desc);
  assert(`Using @computed for only a setter does not make sense. Add a getter for '${key}' as well or remove the @computed decorator.`, 'get' in desc && desc.get !== undefined);

  let { get, set } = desc;

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

    // Set flag to assert on redundant @readOnly
    setter.isMissingSetter = true;
  }

  return emberComputed(...params, { get, set: setter });
});

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
export const readOnly = computedDecorator((target, name, desc) => {
  assert(`Attempted to apply @readOnly to '${name}', but it was not a computed property. Note that @readOnly must come before computed decorators`, desc && desc.isDescriptor);
  assert(`Attempted to apply @readOnly to a computed property that didn't have a setter, which is unnecessary`, !desc._setter || !desc._setter.isMissingSetter);

  return desc.readOnly();
});
