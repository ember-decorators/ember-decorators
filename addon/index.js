import Ember from 'ember';

const { get, computed } = Ember;

function handleDescriptor(target, key, descriptor) {
  let originalParams = descriptor.__originalParams || [];
  let computedDescriptor;

  if (descriptor.writable) {
    computedDescriptor = callUserSuppliedFunction(originalParams, descriptor.value);
  } else {
    throw new Error('ember-computed-decorators does not support using getters and setters');
  }

  descriptor.value = computed.apply(null, originalParams.concat(computedDescriptor));

  return descriptor;
}

function callUserSuppliedFunction(params, func) {
  return function() {
    let paramValues = params.map(p => get(this, p));

    return func.apply(this, paramValues);
  };
}

function isDescriptor(item) {
  return item && typeof item === 'object';
}

export default function computedDecorator(...params) {
  // determine if user called as @computed('blah', 'blah') or @computed
  if (isDescriptor(params[params.length - 1])) {
    return handleDescriptor(...arguments);
  } else {
    return function(target, key, descriptor) {
      descriptor.__originalParams = params;

      return handleDescriptor(...arguments);
    };
  }
}
