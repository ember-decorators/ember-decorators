import { decoratorWithParams } from './decorator-wrappers';
import extractValue from './extract-value';

export function decoratorWithKeyReflection(fn) {
  return decoratorWithParams(function(target, key, desc, params) {
    if (params.length === 0) {
      return fn(key);
    }

    return fn(...params);
  });
}

export function decoratorWithRequiredParams(fn, errorMessage) {
  return decoratorWithParams(function(target, key, desc, params) {
    if (params.length === 0) {
      throw new Error(errorMessage);
    }

    const value = extractValue(desc);
    return fn(...params, value);
  });
}

export function decoratedPropertyWithRequiredParams(fn, errorMessage) {
  return decoratorWithParams(function(target, key, desc, params) {
    if (params.length === 0) {
      throw new Error(errorMessage);
    }

    return fn(...params);
  });
}
