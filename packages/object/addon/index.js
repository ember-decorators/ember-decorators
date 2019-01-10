import { assert } from '@ember/debug';

import { computed as emberComputed } from '@ember/object';
import { addListener, removeListener } from '@ember/object/events';
import { addObserver, removeObserver } from '@ember/object/observers';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import { decorator, decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';
import {
  computedDecoratorWithParams,
} from '@ember-decorators/utils/computed';

const BINDINGS_MAP = new WeakMap();

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
    'The @action decorator must be applied to methods',
    desc && desc.kind === 'method' && desc.descriptor && typeof desc.descriptor.value === 'function'
  );


  let actionFn = desc.descriptor.value;

  desc.descriptor = {
    get() {
      let bindings = BINDINGS_MAP.get(this);

      if (bindings === undefined) {
        bindings = new Map();
        BINDINGS_MAP.set(this, bindings);
      }

      let fn = bindings.get(actionFn);

      if (fn === undefined) {
        fn = actionFn.bind(this);
        bindings.set(actionFn, fn);
      }

      return fn;
    }
  }

  desc.finisher = target => {
    let { key } = desc;
    let { prototype } = target;

    collapseProto(prototype);

    if (!prototype.hasOwnProperty('actions')) {
      let parentActions = prototype.actions;
      prototype.actions = parentActions ? Object.create(parentActions) : {};
    }

    prototype.actions[key] = actionFn;

    return target;
  };

  return desc;
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
export const computed = computedDecoratorWithParams(({ key, descriptor, initializer }, params = []) => {
  assert(
    `@computed can only be used on accessors or fields, attempted to use it with ${key} but that was a method. Try converting it to a getter (e.g. \`get ${key}() {}\`)`,
    !(descriptor && typeof descriptor.value === 'function')
  );

  assert(
    `@computed can only be used on empty fields. ${key} has an initial value (e.g. \`${key} = someValue\`)`,
    !initializer
  );

  let lastArg = params[params.length - 1];
  let get, set;

  if (typeof lastArg === 'function') {
    params.pop();
    get = lastArg;
  }

  if (typeof lastArg === 'object' && lastArg !== null) {
    params.pop();
    get = lastArg.get;
    set = lastArg.set;
  }

  assert(
    `Attempted to apply a computed property that already has a getter/setter to a ${key}, but it is a method or an accessor. If you passed @computed a function or getter/setter (e.g. \`@computed({ get() { ... } })\`), then it must be applied to a field`,
    !(descriptor && (typeof get === 'function' || typeof 'set' === 'function') && (typeof descriptor.get === 'function' || typeof descriptor.get === 'function'))
  );

  let usedClassDescriptor = false;

  if (get === undefined && set === undefined) {
    usedClassDescriptor = true;
    get = descriptor.get;
    set = descriptor.set;
  }

  assert(
    `Attempted to use @computed on ${key}, but it did not have a getter or a setter. You must either pass a get a function or getter/setter to @computed directly (e.g. \`@computed({ get() { ... } })\`) or apply @computed directly to a getter/setter`,
    typeof get === 'function' || typeof 'set' === 'function'
  );

  if (descriptor !== undefined) {
    // Unset the getter and setter so the descriptor just has a plain value
    descriptor.get = undefined;
    descriptor.set = undefined;
  }

  let setter = set;

  if (usedClassDescriptor === true && typeof set === 'function') {
    // Because the setter was defined using class syntax, it cannot have the
    // same `set(key, value)` signature, and it may not return a value. We
    // convert the call internally to pass the value as the first parameter,
    // and check to see if the return value is undefined and if so call the
    // getter again to get the value explicitly.
    setter = function(key, value) {
      let ret = set.call(this, value);
      return typeof ret === 'undefined' ? get.call(this) : ret;
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

  return desc;
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

  return desc;
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

  return desc;
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

  return desc;
}, 'off');
