import { assert } from '@ember/debug';

import EmberObject from '@ember/object';
import { expandProperties } from '@ember/object/computed';
import { addListener, removeListener } from '@ember/object/events';
import { addObserver, removeObserver } from '@ember/object/observers';

import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';

/**
  Triggers the target function when the dependent properties have changed. Note,
  `@observes` _must_ be used on EmberObject based classes only, otherwise there
  may be subtle issues and breakage.

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
export const observes = decoratorWithRequiredParams((target, key, desc, params) => {
  assert(
    'The @observes decorator must be applied to functions',
    desc && typeof desc.value === 'function'
  );

  assert(
    `You attempted to use @observes on ${
      target.constructor.name
    }#${key}, which does not extend from EmberObject. Unfortunately this does not work with stage 1 decorator transforms, and will break in subtle ways. You must rewrite your class to extend from EmberObject.`,
    target instanceof EmberObject
  );

  for (let path of params) {
    expandProperties(path, expandedPath => {
      addObserver(target, expandedPath, null, key);
    });
  }

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
export const unobserves = decoratorWithRequiredParams((target, key, desc, params) => {
  for (let path of params) {
    expandProperties(path, expandedPath => {
      removeObserver(target, expandedPath, null, key);
    });
  }

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
export const on = decoratorWithRequiredParams((target, key, desc, params) => {
  assert(
    'The @on decorator must be applied to functions',
    desc && typeof desc.value === 'function'
  );

  for (let eventName of params) {
    addListener(target, eventName, null, key);
  }

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
export const off = decoratorWithRequiredParams((target, key, desc, params) => {
  for (let eventName of params) {
    removeListener(target, eventName, null, key);
  }

  return desc;
}, 'off');
