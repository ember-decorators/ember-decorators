import { assert, deprecate } from '@ember/debug';

import {
  isDescriptor,
  isStage2FieldDescriptor,
  convertStage1ToStage2,
} from './-private/class-field-descriptor';

const IS_EDGE =
  typeof FastBoot === 'undefined' &&
  /Edge\/\d/.test(window.navigator.userAgent);

const ensureFunctionPrototype = IS_EDGE
  ? fn => Object.setPrototypeOf(fn, Function.prototype)
  : fn => fn;

export function decorator(fn) {
  return ensureFunctionPrototype(function(...params) {
    if (isStage2FieldDescriptor(params)) {
      deprecate(
        'You are using the stage 2 decorator trasforms (@ember-decorators/babel-transforms v3-v5). Ember has officially adopted the stage 1 transforms instead. The stage 2 transforms will not be supported in ember-decorators v6. You can update `ember-cli-babel` to the latest version (at least 7.7.3) and remove @ember-decorators/babel-transforms from your app/addon.',
        false,
        {
          id: 'action-deprecation',
          until: '6.0.0',
        }
      );

      let desc = params[0];

      return fn(desc);
    } else {
      let desc = convertStage1ToStage2(params);

      desc = fn(desc) || desc;

      if (typeof desc.finisher === 'function') {
        // Finishers are supposed to run at the end of class finalization,
        // but we don't get that with stage 1 transforms. We have to be careful
        // to make sure that we aren't doing any operations which would change
        // due to timing.
        let [target] = params;

        desc.finisher(target.prototype ? target : target.constructor);
      }

      if (typeof desc.initializer === 'function') {
        // Babel 6 / the legacy decorator transform needs the initializer back
        // on the property descriptor/ In case the user has set a new
        // initializer on the member descriptor, we transfer it back to
        // original descriptor.
        desc.descriptor.initializer = desc.initializer;
      }

      return desc.descriptor;
    }
  });
}

/**
 * A macro that takes a decorator function and allows it to optionally
 * receive parameters
 *
 * ```js
 * let foo = decoratorWithParams((target, desc, key, params) => {
 *   console.log(params);
 * });
 *
 * class {
 *   @foo bar; // undefined
 *   @foo('bar') baz; // ['bar']
 * }
 * ```
 *
 * @param {Function} fn - decorator function
 */
export function decoratorWithParams(fn) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params)) {
      return decorator(fn)(...params);
    } else {
      return decorator(desc => fn(desc, params));
    }
  };
}

/**
 * A macro that takes a decorator function and requires it to receive
 * parameters:
 *
 * ```js
 * let foo = decoratorWithRequiredParams((target, desc, key, params) => {
 *   console.log(params);
 * });
 *
 * class {
 *   @foo('bar') baz; // ['bar']
 *   @foo bar; // Error
 * }
 * ```
 *
 * @param {Function} fn - decorator function
 */
export function decoratorWithRequiredParams(fn, name) {
  return function(...params) {
    assert(
      `The @${name || fn.name} decorator requires parameters`,
      !isDescriptor(params) && params.length > 0
    );

    return decorator(desc => {
      return fn(desc, params);
    });
  };
}
