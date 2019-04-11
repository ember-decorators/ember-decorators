function isClassDescriptor(possibleDesc) {
  let [target] = possibleDesc;

  return (
    possibleDesc.length === 1 &&
    typeof target === 'function' &&
    'prototype' in target &&
    !target.__isComputedDecorator
  );
}

export function isFieldDescriptor(possibleDesc) {
  let [target, key, desc] = possibleDesc;

  return (
    possibleDesc.length === 3 &&
    typeof target === 'object' &&
    target !== null &&
    typeof key === 'string' &&
    ((typeof desc === 'object' &&
      desc !== null &&
      'enumerable' in desc &&
      'configurable' in desc) ||
      desc === undefined) // TS compatibility
  );
}

export function isDescriptor(possibleDesc) {
  return isFieldDescriptor(possibleDesc) || isClassDescriptor(possibleDesc);
}
