import { DEBUG } from '@glimmer/env';
import { assert } from '@ember/debug';
import { THROW_ON_COMPUTED_OVERRIDE } from 'ember-decorators-flags';

import { computed as emberComputed } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { addObserver, removeObserver } from '@ember/object/observers';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import { decorator, decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import {
  computedDescriptorFor,
  computedDecoratorWithParams,
  getOrCreateModifierMeta,
} from '@ember-decorators/utils/computed';

/**
  Decorator that turns the target function into an Action

  Adds an `actions` object to the target object and creates a passthrough
  function that calls the original. This means the function still exists
  on the original object, and can be used directly.

  ```js
  export default class ActionDemoComponent extends Component {
    @action
    foo() {
      // do something
    }
  }
  ```

  ```hbs
  <!-- template.hbs -->
  <button onclick={{action "foo"}}>Execute foo action</button>
  ```

  @return {Function}
*/
export const action = decorator(desc => {
  assert(
    'The @action decorator must be applied to functions',
    desc && desc.descriptor && typeof desc.descriptor.value === 'function'
  );

  desc.finisher = target => {
    let { key, descriptor } = desc;
    let { prototype } = target;

    collapseProto(prototype);

    if (!prototype.hasOwnProperty('actions')) {
      let parentActions = prototype.actions;
      prototype.actions = parentActions ? Object.create(parentActions) : {};
    }

    prototype.actions[key] = descriptor.value;

    return target;
  };
});

/**
  Decorator that turns a native getter/setter into a computed property. Note
  that though they use getters and setters, you must still use the Ember `get`/
  `set` functions to get and set their values.

  ```js
  import Component from '@ember/component';
  import { computed } from '@ember-decorators/object';

  export default class UserProfileComponent extends Component {
    first = 'John';
    last = 'Smith';

    @computed('first', 'last')
    get name() {
      const first = this.get('first');
      const last = this.get('last');

      return `${first} ${last}`; // => 'John Smith'
    }

    set name(value) {
      if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
        throw new TypeError('Invalid name');
      }

      const [first, last] = value.split(' ');
      this.setProperties({ first, last });

      return value;
    }
  }
  ```

  @function
  @param {...string} propertyNames - List of property keys this computed is dependent on
  @return {ComputedProperty}
*/
export const computed = computedDecoratorWithParams(({ key, descriptor }, params) => {
  assert(
    `Attempted to apply @computed to ${key}, but it is not a native accessor function. Try converting it to \`get ${key}()\``,
    'get' in descriptor || 'set' in descriptor
  );
  assert(
    `Using @computed for only a setter does not make sense. Add a getter for '${key}' as well or remove the @computed decorator.`,
    'get' in descriptor && descriptor.get !== undefined
  );

  let { get, set } = descriptor;

  // Unset the getter and setter so the descriptor just has a plain value
  descriptor.get = undefined;
  descriptor.set = undefined;

  let setter;

  if (typeof set === 'function') {
    setter = function(key, value) {
      let ret = set.call(this, value);
      return typeof ret === 'undefined' ? get.call(this) : ret;
    };
  } else if (DEBUG && THROW_ON_COMPUTED_OVERRIDE) {
    setter = function(key) {
      assert(
        `Attempted to set ${key}, but it does not have a setter. Overriding a computed property without a setter has been deprecated.`,
        false
      );
    };
  }

  return emberComputed(...params, { get, set: setter });
});

/**
  Triggers the target function when the dependent properties have changed

  ```javascript
  import { observes } from '@ember-decorators/object';

  class Foo {
    @observes('foo')
    bar() {
      //...
    }
  }
  ```

  @function
  @param {...String} propertyNames - Names of the properties that trigger the function
 */
export const observes = decoratorWithRequiredParams((desc, params) => {
  assert(
    'The @observes decorator must be applied to functions',
    desc && desc.descriptor && typeof desc.descriptor.value === 'function'
  );

  desc.finisher = target => {
    let { prototype } = target;

    for (let path of params) {
      addObserver(prototype, path, null, desc.key);
    }

    return target;
  };
}, 'observes');

/**
  Removes observers from the target function.

  ```javascript
  import { observes, unobserves } from '@ember-decorators/object';

  class Foo {
    @observes('foo')
    bar() {
      //...
    }
  }

  class Bar extends Foo {
    @unobserves('foo') bar;
  }
  ```

  @function
  @param {...String} propertyNames - Names of the properties that no longer trigger the function
 */
export const unobserves = decoratorWithRequiredParams((desc, params) => {
  desc.finisher = target => {
    let { prototype } = target;

    for (let path of params) {
      removeObserver(prototype, path, null, desc.key);
    }

    return target;
  };
}, 'unobserves');

/**
  Adds an event listener to the target function.

  ```javascript
  import { on } from '@ember-decorators/object';

  class Foo {
    @on('fooEvent', 'barEvent')
    bar() {
      //...
    }
  }
  ```

  @function
  @param {...String} eventNames - Names of the events that trigger the function
 */
export const on = decoratorWithRequiredParams((desc, params) => {
  assert(
    'The @on decorator must be applied to functions',
    desc && desc.descriptor && typeof desc.descriptor.value === 'function'
  );

  desc.finisher = target => {
    let { prototype } = target;

    for (let eventName of params) {
      addListener(prototype, eventName, null, desc.key);
    }

    return target;
  };
}, 'on');

/**
  Removes an event listener from the target function.

  ```javascript
  import { on, off } from '@ember-decorators/object';

  class Foo {
    @on('fooEvent', 'barEvent')
    bar() {
      //...
    }
  }

  class Bar extends Foo {
    @off('fooEvent', 'barEvent') bar;
  }
  ```

  @function
  @param {...String} eventNames - Names of the events that no longer trigger the function
 */
export const off = decoratorWithRequiredParams((desc, params) => {
  desc.finisher = target => {
    let { prototype } = target;

    for (let eventName of params) {
      removeListener(prototype, eventName, null, desc.key);
    }

    return target;
  };
}, 'off');

/**
  Decorator that modifies a computed property to be read only.

  ```js
  import Component from '@ember/component';
  import { computed, readOnly } from 'ember-decorators/object';

  export default class extends Component {
    @readOnly
    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  }
  ```

  @return {ComputedProperty}
*/
export const readOnly = decorator(desc => {
  desc.finisher = target => {
    let { prototype } = target;
    let { key } = desc;

    if (DEBUG) {
      let modifierMeta = getOrCreateModifierMeta(prototype, name);

      assert(
        'A computed property cannot be both readOnly and volatile. Use a native setter instead',
        modifierMeta[key] !== 'volatile'
      );
    }

    // TODO(v4): We can't know for sure whether or not the computed descriptor
    // has already been added, it may have if decorators are stage 1, so we have
    // to check and modify it if it has.
    let computedDesc = computedDescriptorFor(prototype, key);

    if (computedDesc !== undefined) {
      if (DEBUG) {
        let modifierMeta = getOrCreateModifierMeta(prototype, name);
        modifierMeta[key] = 'readOnly';
      }

      computedDesc.readOnly();
    } else {
      let modifierMeta = getOrCreateModifierMeta(prototype, name);
      modifierMeta[key] = 'readOnly';
    }
  };
});

/**
  Decorator that modifies a computed property to be volatile.

  ```js
  import Component from '@ember/component';
  import { computed, readOnly } from 'ember-decorators/object';

  export default class extends Component {
    @volatile
    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  }
  ```

  @return {ComputedProperty}
*/
export const volatile = decorator(desc => {
  desc.finisher = target => {
    let { prototype } = target;
    let { key } = desc;

    if (DEBUG) {
      let modifierMeta = getOrCreateModifierMeta(prototype, name);

      assert(
        'A computed property cannot be both readOnly and volatile. Use a native getter instead',
        modifierMeta[key] !== 'readOnly'
      );
    }

    // TODO(v4): We can't know for sure whether or not the computed descriptor
    // has already been added, it may have if decorators are stage 1, so we have
    // to check and modify it if it has.
    let computedDesc = computedDescriptorFor(prototype, key);

    if (computedDesc !== undefined) {
      if (DEBUG) {
        let modifierMeta = getOrCreateModifierMeta(prototype, name);
        modifierMeta[key] = 'volatile';
      }

      computedDesc.volatile();
    } else {
      let modifierMeta = getOrCreateModifierMeta(prototype, name);
      modifierMeta[key] = 'volatile';
    }
  };
});
