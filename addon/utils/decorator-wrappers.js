import isDescriptor from './is-descriptor';

function handleDescriptor(target, key, desc, fn, params = []) {
  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writeable: desc.writeable,
    value: fn(target, key, desc, params)
  };
}

export function decorator(fn) {
  return function(...params) {
    return handleDescriptor(...arguments, fn, params);
  };
}

export function decoratorWithParams(fn) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params[params.length - 1])) {
      return handleDescriptor(...arguments, fn);
    } else {
      return function(/* target, key, desc */) {
        return handleDescriptor(...arguments, fn, params);
      };
    }
  };
}
