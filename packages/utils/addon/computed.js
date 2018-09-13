import { defineProperty } from '@ember/object';
import { computedDescriptorFor, isDescriptor, isComputedDescriptor } from './-private';
import { assert } from '@ember/debug';

import { HAS_NATIVE_COMPUTED_GETTERS } from 'ember-compatibility-helpers';
import { THROW_ON_COMPUTED_OVERRIDE } from 'ember-decorators-flags';

/**
 * A macro that receives a decorator function which returns a ComputedProperty,
 * and defines that property using `Ember.defineProperty`. Conceptually, CPs
 * are custom property descriptors that require Ember's intervention to apply
 * correctly. In the future, we will use finishers to define the CPs rather than
 * directly defining them in the decorator function.
 *
 * @param {Function} fn - decorator function
 */
export function computedDecorator(fn, readOnly, volatile, params) {
  let props;
  let meta;

  let decorator = function(target, key, desc) {
    let previousDesc = computedDescriptorFor(target, key) || desc;
    let computedDesc = fn(target, key, previousDesc, params);

    assert(`computed decorators must return an instance of an Ember ComputedProperty descriptor, received ${computedDesc}`, isComputedDescriptor(computedDesc));

    if (!HAS_NATIVE_COMPUTED_GETTERS) {
      // Until recent versions of Ember, computed properties would be defined
      // by just setting them. We need to blow away any predefined properties
      // (getters/setters, etc.) to allow Ember.defineProperty to work correctly.
      Object.defineProperty(target, key, {
        configurable: true,
        writable: true,
        enumerable: true,
        value: undefined
      });
    }

    if (readOnly === true) {
      assert('computed overrides have been disabled in decorators, theres no need to use `readOnly` on computed properties', !THROW_ON_COMPUTED_OVERRIDE);

      computedDesc.readOnly();
    }

    if (volatile === true) {
      computedDesc.volatile();
    }

    if (props !== undefined) {
      computedDesc.property(...props);
    }

    if (meta !== undefined) {
      computedDesc.meta(meta);
    }

    defineProperty(target, key, computedDesc);

    // There's currently no way to disable redefining the property when decorators
    // are run, so return the property descriptor we just assigned
    return Object.getOwnPropertyDescriptor(target, key);
  }

  decorator.property = function(...keyNames) {
    if (props === undefined) {
      props = [];
    }

    props.push(...keyNames);
    return this;
  };

  decorator.meta = function(props) {
    meta = props;
    return this;
  }

  return decorator;
}

function paramCaptureDecorator(fn, readOnly, volatile) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params)) {
      let innerDecorator = computedDecorator(fn, readOnly, volatile, []);
      return innerDecorator(...params);
    } else {
      return computedDecorator(fn, readOnly, volatile, params);
    }
  };
}

function requiredParamCaptureDecorator(fn, readOnly, volatile) {
  return function(...params) {
    assert(`Cannot decorate member '${params[1]}' without parameters`, !isDescriptor(params));
    assert(`Cannot decorate member '${key}' without parameters`, params.length > 0)

    return computedDecorator(fn, readOnly, volatile, params);
  }
}

export function computedDecoratorWithParams(fn) {
  let standardDecorator = paramCaptureDecorator(fn, false, false);

  standardDecorator.readOnly = paramCaptureDecorator(fn, true, false);
  standardDecorator.volatile = paramCaptureDecorator(fn, false, true);

  return standardDecorator;
}

export function computedDecoratorWithRequiredParams(fn) {
  let standardDecorator = requiredParamCaptureDecorator(fn, false, false);

  standardDecorator.readOnly = requiredParamCaptureDecorator(fn, true, false);

  return standardDecorator;
}
