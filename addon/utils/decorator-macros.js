import { decoratorWithParams } from './decorator-wrappers';
import extractValue from './extract-value';

import { assert } from '@ember/debug';

export function decoratorWithKeyReflection(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    if (params.length === 0) {
      return fn(key);
    }

    return fn(...params);
  });
}

export function decoratorWithRequiredParams(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    assert(`Cannot use '${fn.name}' on field '${key}' without parameters`, params.length !== 0);

    const value = extractValue(desc);
    return fn(...params, value);
  });
}

export function decoratedPropertyWithRequiredParams(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    assert(`Cannot use '${fn.name}' on field '${key}' without parameters`, params.length !== 0);

    return fn(...params);
  });
}

export function decoratedPropertyWithOptionalCallback(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    assert(`Cannot use '${fn.name}' on field '${key}' without parameters`, params.length !== 0);

    if (typeof params[params.length - 1] === 'function') {
      return fn(...params);
    }

    if (typeof params[params.length - 1] === 'string' && target[params[params.length - 1]]) {
      return fn(...params);
    }

    const value = extractValue(desc);
    assert(`Cannot use '${fn.name}' on field '${key}' without a callback`, typeof value === 'function');

    return fn(...params, value);
  });
}
