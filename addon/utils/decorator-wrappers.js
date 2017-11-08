import isDescriptor from './is-descriptor';
import normalizeDescriptor from './normalize-descriptor';

function handleDescriptor(target, key, desc, fn, params = []) {
  normalizeDescriptor(desc);

  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writable: desc.writable,
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
      return function(target, key, desc) {
        const hasDecorator = (typeof params[0]) === "function";
        const decorators = hasDecorator ? params.filter(param => (typeof param) === "function") : [];
        const nonDecorators = hasDecorator ? params.filter(param => (typeof param) !== "function") : params;
        const newProperties = decorators.map((func, index) => {
          const prop = `_private_${key}_${index}`;
          Object.defineProperty(target, prop, func(target, prop, desc));
          return prop;
        });
        const properties = [...newProperties, ...nonDecorators];
        return handleDescriptor(...arguments, fn, properties);
      };
    }
  };
}
