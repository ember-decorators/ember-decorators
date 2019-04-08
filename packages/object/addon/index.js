import { assert } from '@ember/debug';

import Ember from 'ember';
import EmberObject from '@ember/object';
import { expandProperties } from '@ember/object/computed';
import { addListener, removeListener } from '@ember/object/events';
import { addObserver, removeObserver } from '@ember/object/observers';

import { decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';

let hasChainsFinished = false;
const CHAINS_FINISHED = new WeakMap();

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
        },
      },
    ];
  }

  desc.finisher = target => {
    hasChainsFinished = false;
    let { prototype } = target;

    assert(
      `You attempted to use @observes on ${target.name}#${
        desc.key
      }, which does not extend from EmberObject. Unfortunately this does not work with stage 1 decorator transforms, and will break in subtle ways. You must rewrite your class to extend from EmberObject.`,
      prototype instanceof EmberObject
    );

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
