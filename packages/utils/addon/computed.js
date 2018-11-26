import { defineProperty } from '@ember/object';
import { decoratorWithParams, decoratorWithRequiredParams, decorator } from './decorator';
import { HAS_NATIVE_COMPUTED_GETTERS } from 'ember-compatibility-helpers';
import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';

import { computedDescriptorFor, isComputedDescriptor } from './-private/descriptor';
import { getModifierMeta, getOrCreateModifierMeta } from './-private/modifier-meta';

import { assert } from '@ember/debug';

export { computedDescriptorFor, getModifierMeta, getOrCreateModifierMeta };

/**
 * A macro that receives a decorator function which returns a ComputedProperty,
 * and defines that property using `Ember.defineProperty`. Conceptually, CPs
 * are custom property descriptors that require Ember's intervention to apply
 * correctly. In the future, we will use finishers to define the CPs rather than
 * directly defining them in the decorator function.
 *
 * @param {Function} fn - decorator function
 */
function computedDecoratorInner(fn) {
  return (desc, params = []) => {
    desc.placement = 'prototype';

    desc.finisher = function initializeComputedProperty(target) {
      let { prototype } = target;
      let { key } = desc;

      assert(`ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`, !computedDescriptorFor(prototype, key));

      let computedDesc = fn(desc, params);

      assert(`computed decorators must return an instance of an Ember ComputedProperty descriptor, received ${computedDesc}`, isComputedDescriptor(computedDesc));

      let modifierMeta = getModifierMeta(prototype);

      if (modifierMeta !== undefined && modifierMeta[key] !== undefined) {
        computedDesc[modifierMeta[key]]();
      }

      if (!HAS_NATIVE_COMPUTED_GETTERS) {
        // Until recent versions of Ember, computed properties would be defined
        // by just setting them. We need to blow away any predefined properties
        // (getters/setters, etc.) to allow Ember.defineProperty to work correctly.
        Object.defineProperty(prototype, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: undefined
        });
      }

      defineProperty(prototype, key, computedDesc);

      if (NEEDS_STAGE_1_DECORATORS) {
        // There's currently no way to disable redefining the property when decorators
        // are run, so return the property descriptor we just assigned
        desc.descriptor = Object.getOwnPropertyDescriptor(prototype, key);
      }

      return target;
    }
  }
}

export function computedDecorator(fn) {
  return decorator(computedDecoratorInner(fn));
}

export function computedDecoratorWithParams(fn) {
  return decoratorWithParams(computedDecoratorInner(fn));
}

export function computedDecoratorWithRequiredParams(fn, name) {
  return decoratorWithRequiredParams(computedDecoratorInner(fn), name);
}
