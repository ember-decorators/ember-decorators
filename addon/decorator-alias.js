export default function decoratorAlias(fn, errorMessage) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (params.length === 0) {
      throw new Error(errorMessage);
    } else {
      return function(target, key, desc) {
        return {
          enumerable: desc.enumerable,
          configurable: desc.configurable,
          writable: desc.writable,
          initializer: function() {
            var value = desc.value || typeof desc.initializer === 'function' && desc.initializer();
            return fn.apply(null, params.concat(value));
          }
        };
      };
    }
  };
}
