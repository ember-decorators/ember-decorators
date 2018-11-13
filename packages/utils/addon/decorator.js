import { assert } from '@ember/debug';

import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';

function isDescriptor(possibleDesc) {
  let isDescriptor = isStage2Descriptor(possibleDesc);

  if (NEEDS_STAGE_1_DECORATORS) {
    isDescriptor = isDescriptor || isStage1Descriptor(possibleDesc);
  }

  return isDescriptor;
}

function isStage1Descriptor(possibleDesc) {
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
  } else if (possibleDesc.length === 1) {
    let [target] = possibleDesc;

    return typeof target === 'function' && 'prototype' in target;
  }

  return false;
}

function isStage2Descriptor(possibleDesc) {
  return possibleDesc && possibleDesc.toString() === '[object Descriptor]';
}

function kindForDesc(desc) {
  if ('value' in desc && desc.enumerable === true) {
    return 'field';
  } else {
    return 'method';
  }
}

function placementForKind(kind) {
  return kind === 'method' ? 'prototype' : 'own';
}

function convertStage1ToStage2(desc) {
  if (desc.length === 3) {
    // Class element decorator
    let [, key, descriptor] = desc;

    let kind = kindForDesc(desc);
    let placement = placementForKind(kind);

    return {
      descriptor,
      key,
      kind,
      placement,
    };
  } else {
    // Class decorator
    return {
      kind: 'class',
      elements: [],
    };
  }
}

export function decorator(fn) {
  if (NEEDS_STAGE_1_DECORATORS) {
    return function(...params) {
      if (isStage2Descriptor(params)) {
        let desc = params[0];

        return fn(desc);
      } else {
        let desc = convertStage1ToStage2(params);

        fn(desc);

        if (desc.finisher) {
          // Finishers are supposed to run at the end of class finalization,
          // but we don't get that with stage 1 transforms. We have to be careful
          // to make sure that we aren't doing any operations which would change
          // due to timing.
          let [target] = params;

          desc.finisher(target.prototype ? target : target.constructor);
        }

        return desc.descriptor;
      }
    }
  } else {
    return fn;
  }
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
    assert(`The @${name || fn.name} decorator requires parameters`, !isDescriptor(params) && params.length > 0);

    return decorator(desc => {
      return fn(desc, params);
    });
  }
}
