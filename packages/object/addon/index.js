import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';
import { assert } from '@ember/debug';

import Ember from 'ember';
import EmberObject, { computed as emberComputed } from '@ember/object';
import ComputedProperty, { expandProperties } from '@ember/object/computed';
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

  Also binds the function directly to the instance, so it can be used in any
  context:

  ```hbs
  <!-- template.hbs -->
  <button onclick={{this.foo}}>Execute foo action</button>
  ```

  @function
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
    first = 'Bruce';
    last = 'Wayne';

    @computed('first', 'last')
    get name() {
      return `${this.first} ${this.last}`; // => 'Bruce Wayne'
    }

    set name(value) {
      if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
        throw new TypeError('Invalid name');
      }

      const [first, last] = value.split(' ');
      this.setProperties({ first, last });
    }
  }
  ```

  Can also be optionally passed a computed property descriptor (e.g. a function
  or an object with `get` and `set` functions on it):

  ```js
  let fullNameComputed = computed('firstName', 'lastName', {
    get() {
      return `${this.first} ${this.last}`; // => 'Diana Prince'
    },

    set(key, value) {
      if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
        throw new TypeError('Invalid name');
      }

      const [first, last] = value.split(' ');
      this.setProperties({ first, last });

      return value;
    }
  })

  export default class UserProfileComponent extends Component {
    first = 'Diana';
    last = 'Prince';

    @fullNameComputed fullName;
  }
  ```

  @function
  @param {...string} propertyNames - List of property keys this computed is dependent on
  @param {ComputedPropertyDesc?} desc - Optional computed property getter/setter
  @return {ComputedDecorator}
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

  assert(
    `computed properties should not be passed to @computed directly, use wrapComputed for the value passed to ${key} instead`,
    !((typeof lastArg === 'function' || typeof lastArg === 'object') && lastArg instanceof ComputedProperty)
  );


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
  Wraps an instance of a ComputedProperty, turning it into a decorator:

  ```js
  import Component from '@ember/component';
  import { computed } from '@ember/object';
  import { wrapComputed } from '@ember-decorators/object';

  export default class UserProfileComponent extends Component {
    first = 'Bruce';
    last = 'Wayne';

    @wrapComputed(
      computed('first', 'last', function() {
        return `${this.first} ${this.last}`; // => 'Bruce Wayne'
      })
    ) fullName;
  }
  ```

  @param {ComputedProperty} cp - an instance of a computed property
  @return {ComputedDecorator}
*/
export const wrapComputed = computedDecoratorWithParams((desc, params) => {
  assert(`wrapComputed should receive exactly one parameter, a ComputedProperty. Received ${params} for ${desc.key}`, params.length === 1);
  assert(`wrapComputed should receive an instance of a ComputedProperty. Received ${params} for ${desc.key}`, params[0] instanceof ComputedProperty);
  assert(`wrapComputed received a ComputedDecorator for ${desc.key}. Because the value is already a decorator, there is no need to wrap it.`, !params[0].__isComputedDecorator);

  return params[0];
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
let hasChainsFinished = false;
const CHAINS_FINISHED = new WeakMap();

export const observes = decoratorWithRequiredParams((desc, params) => {
  assert(
    'The @observes decorator must be applied to functions',
    desc && desc.descriptor && typeof desc.descriptor.value === 'function'
  );

  // hasChainsFinished will be set to true when the first initializer field
  // is added during class evaluation, then back to false when the finishers
  // run. This is not ideal, but shouldn't be an issue in the future when we
  // have the ability to add arbitrary initializers that don't have to be fields
  if (hasChainsFinished === false) {
    hasChainsFinished = true;

    // hackity hackity haaaaaack
    desc.extras = [
      {
        kind: 'field',
        placement: 'own',
        key: '__EMBER_DECORATORS_FINISH_CHAINS__',
        descriptor: {
          enumerable: false,
          writable: true,
          configurable: true,
        },
        initializer() {
          if (!(this instanceof EmberObject) && !CHAINS_FINISHED.has(this)) {
            Ember.finishChains(Ember.meta(this));

            CHAINS_FINISHED.set(this, true);
          }
        }
      }
    ];
  }

  desc.finisher = target => {
    hasChainsFinished = false;
    let { prototype } = target;

    if (NEEDS_STAGE_1_DECORATORS) {
      assert(
        `You attempted to use @observes on ${target.name}#${desc.key}, which does not extend from EmberObject. This does not work with stage 1 decorator transforms, and will break in subtle ways. You must either update to the stage 2 transforms (@ember-decorators/babel-transforms v3.1+) or rewrite your class to extend from EmberObject.`,
        prototype instanceof EmberObject
      );
    }


    for (let path of params) {
      expandProperties(path, expandedPath => {
        addObserver(prototype, expandedPath, null, desc.key);
      });
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
      expandProperties(path, expandedPath => {
        removeObserver(prototype, expandedPath, null, desc.key);
      });
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
