import isDescriptor from './is-descriptor';

function handleDescriptor(target, key, desc, fn, params = []) {
  desc.value = fn(target, key, desc, params);
  desc.initializer = undefined; // unset the initializer if it exists
  return desc;
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
