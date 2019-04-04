function isStage1ClassDescriptor(possibleDesc) {
  let [target] = possibleDesc;

  return (
    possibleDesc.length === 1 &&
    typeof target === 'function' &&
    'prototype' in target &&
    !target.__isComputedDecorator
  );
}

function isStage1FieldDescriptor(possibleDesc) {
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

export function isStage2FieldDescriptor(possibleDesc) {
  return possibleDesc && possibleDesc.toString() === '[object Descriptor]';
}

export function isFieldDescriptor(possibleDesc) {
  return isStage2FieldDescriptor(possibleDesc) || isStage1FieldDescriptor(possibleDesc);
}

export function isDescriptor(possibleDesc) {
  return isFieldDescriptor(possibleDesc) || isStage1ClassDescriptor(possibleDesc);
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

export function convertStage1ToStage2(desc) {
  if (desc.length === 3) {
    // Class element decorator
    let [, key, descriptor] = desc;

    let kind = kindForDesc(desc);
    let placement = placementForKind(kind);

    let initializer = descriptor !== undefined ? descriptor.initializer : undefined;

    return {
      descriptor,
      key,
      kind,
      placement,
      initializer,
      toString: () => '[object Descriptor]',
    };
  } else {
    // Class decorator
    return {
      kind: 'class',
      elements: [],
    };
  }
}
