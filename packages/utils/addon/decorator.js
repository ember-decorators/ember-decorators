import { assert } from '@ember/debug';

function isDescriptor(possibleDesc) {
  if (possibleDesc.length === 3) {
    let [target, key, desc] = possibleDesc;

    return typeof target === 'object'
      && target !== null
      && typeof key === 'string'
      && (
        (
          typeof desc === 'object'
          && desc !== null
          && 'enumerable' in desc
          && 'configurable' in desc
        )
        || desc === undefined // TS compatibility
      );
  }

  return false;
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
      return fn(...params, []);
    } else {
      return function(target, key, desc) {
        return fn(target, key, desc, params);
      };
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
export function decoratorWithRequiredParams(fn) {
  return function(...params) {
    assert(`Cannot decorate member '${params[1]}' without parameters`, !isDescriptor(params));

    return function(target, key, desc) {
      assert(`Cannot decorate member '${key}' without parameters`, params.length > 0)

      return fn(target, key, desc, params);
    };
  }
}
