import { assert } from '@ember/debug';

import { isDescriptor } from './-private/class-field-descriptor';

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
      return fn(...params);
    } else {
      return (...desc) => fn(...desc, params);
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

    return (...desc) => fn(...desc, params);
  };
}
