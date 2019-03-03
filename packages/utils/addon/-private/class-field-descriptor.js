import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';

let isStage1FieldDescriptor;

if (NEEDS_STAGE_1_DECORATORS) {
  isStage1FieldDescriptor = function isStage1FieldDescriptor(possibleDesc) {
    if (possibleDesc.length === 3) {
      let [target, key, desc] = possibleDesc;

      return (
        typeof target === 'object' &&
        target !== null &&
        typeof key === 'string' &&
        ((typeof desc === 'object' &&
          desc !== null &&
          'enumerable' in desc &&
          'configurable' in desc) ||
          desc === undefined) // TS compatibility
      );
    } else if (possibleDesc.length === 1) {
      let [target] = possibleDesc;

      return typeof target === 'function' && 'prototype' in target && !target.__isComputedDecorator;
    }

    return false;
  };
}

export function isStage2FieldDescriptor(possibleDesc) {
  return possibleDesc && possibleDesc.toString() === '[object Descriptor]';
}

export function isFieldDescriptor(possibleDesc) {
  let isDescriptor = isStage2FieldDescriptor(possibleDesc);

  if (NEEDS_STAGE_1_DECORATORS) {
    isDescriptor = isDescriptor || isStage1FieldDescriptor(possibleDesc);
  }

  return isDescriptor;
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
