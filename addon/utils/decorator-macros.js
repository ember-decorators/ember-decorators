import { IS_EMBER_2 } from 'ember-compatibility-helpers';

import { decoratorWithParams } from './decorator-wrappers';
import extractValue from './extract-value';
import collapseProto from './collapse-proto';

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

    const value = extractValue(desc);
    assert(`Cannot use '${fn.name}' on field '${key}' without a callback`, typeof value === 'function');

    return fn(...params, value);
  });
}

export function decoratedPropertyWithEitherCallbackOrProperty(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    assert(`Cannot use '${fn.name}' on field '${key}' without parameters`, params.length !== 0);

    const lastParam = params[params.length - 1]
    const lastParamType = typeof lastParam;

    if (lastParamType === 'function') {
      return fn(...params);
    }

    if (IS_EMBER_2 && params.length > 1 && lastParamType === 'string') {
      return fn(...params);
    }

    const value = extractValue(desc);
    assert(`Cannot use '${fn.name}' on field '${key}' without a callback`, typeof value === 'function');

    return fn(...params, value);
  });
}

export function decoratedConcatenatedProperty(concatProperty) {
  return function(target, key, desc) {
    // Make sure the descriptor is correctly defined, defaults to false
    desc.writable = true;
    desc.configurable = true;

    collapseProto(target);

    if (!target.hasOwnProperty(concatProperty)) {
      let parentValue = target[concatProperty];
      target[concatProperty] = Array.isArray(parentValue) ? parentValue.slice() : [];
    }

    target[concatProperty].push(key);

    // Set the value on the prototype in the case of class fields
    desc.value = extractValue(desc);
    desc.initializer = undefined;

    return desc;
  }
}
