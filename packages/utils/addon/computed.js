import { defineProperty } from '@ember/object';
import { HAS_NATIVE_COMPUTED_GETTERS, gte } from 'ember-compatibility-helpers';
import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';

import { decorator } from './decorator';
import { computedDescriptorFor, isComputedDescriptor } from './-private/descriptor';
import { isFieldDescriptor, isStage2FieldDescriptor } from './-private/class-field-descriptor';

import { DEBUG } from '@glimmer/env';
import { assert } from '@ember/debug';
import ComputedProperty from '@ember/object/computed';

/**
 * A macro that receives a decorator function which returns a ComputedProperty,
 * and defines that property using `Ember.defineProperty`. Conceptually, CPs
 * are custom property descriptors that require Ember's intervention to apply
 * correctly. In the future, we will use finishers to define the CPs rather than
 * directly defining them in the decorator function.
 *
 * @param {Function} fn - decorator function
 */
export let computedDecorator;

if (gte('3.10.0')) {
  class ComputedDecoratorImpl extends Function {
    readOnly() {
      this.__computed.readOnly(...arguments);
      return this;
    }

    volatile() {
      this.__computed.volatile(...arguments);
      return this;
    }

    property() {
      this.__computed.property(...arguments);
      return this;
    }

    meta() {
      this.__computed.meta(...arguments);
      return this;
    }
  }

  computedDecorator = function(fn, params) {
    let computed = params === undefined ? fn() : fn(...params);

    let decorator = (...args) => {
      if (isStage2FieldDescriptor(args)) {
        let desc = args[0];

        desc.finisher = target => {
          let propertyDesc = computed(
            target.prototype,
            desc.key,
            desc.descriptor,
            Ember.meta(target.prototype),
            true
          );

          Object.defineProperty(target.prototype, desc.key, propertyDesc);
        };

        desc.descriptor.configurable = true;

        return desc;
      } else {
        let [prototype, key, propertyDesc] = args;

        return computed(prototype, key, propertyDesc, Ember.meta(prototype), true);
      }
    };

    decorator.__computed = computed;
    Object.setPrototypeOf(decorator, ComputedDecoratorImpl.prototype);

    let setClassicDecorator = Ember._setClassicDecorator || Ember._setComputedDecorator;
    setClassicDecorator(decorator);

    if (DEBUG) {
      // This is for wrapComputed to check against invalid input
      decorator.__isComputedDecorator = true;
    }

    return decorator;
  };
} else {
  const DECORATOR_COMPUTED_FN = new WeakMap();
  const DECORATOR_PARAMS = new WeakMap();
  const DECORATOR_MODIFIERS = new WeakMap();

  // eslint-disable-next-line no-inner-declarations
  function buildComputedDesc(dec, desc) {
    let fn = DECORATOR_COMPUTED_FN.get(dec);
    let params = DECORATOR_PARAMS.get(dec);
    let modifiers = DECORATOR_MODIFIERS.get(dec);

    let computedDesc = fn(desc, params);

    assert(
      `computed decorators must return an instance of an Ember ComputedProperty descriptor, received ${computedDesc}`,
      isComputedDescriptor(computedDesc)
    );

    if (modifiers) {
      modifiers.forEach(m => {
        if (Array.isArray(m)) {
          computedDesc[m[0]](...m[1]);
        } else {
          computedDesc[m]();
        }
      });
    }

    return computedDesc;
  }

  class DecoratorDescriptor extends ComputedProperty {
    setup(obj, key, meta) {
      if (!this._computedDesc) {
        this._computedDesc = buildComputedDesc(this, { key });
      }

      if (gte('3.6.0')) {
        this._computedDesc.setup(obj, key, meta);
      } else if (gte('3.1.0')) {
        let meta = Ember.meta(obj);

        Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          get() {
            return this._computedDesc.get(key);
          },
        });

        meta.writeDescriptors(key, this._computedDesc);
      } else {
        Object.defineProperty(obj, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: this._computedDesc,
        });
      }
    }

    _addModifier(modifier) {
      let modifiers = DECORATOR_MODIFIERS.get(this);

      if (modifiers === undefined) {
        modifiers = [];
        DECORATOR_MODIFIERS.set(this, modifiers);
      }

      modifiers.push(modifier);
    }

    get() {
      return this._innerComputed.get.apply(this, arguments);
    }

    set() {
      return this._innerComputed.get.apply(this, arguments);
    }

    readOnly() {
      this._addModifier('readOnly');
      return this;
    }

    volatile() {
      this._addModifier('volatile');
      return this;
    }

    property(...keys) {
      this._addModifier(['property', keys]);
      return this;
    }
  }

  computedDecorator = function(fn, params) {
    let dec = decorator(desc => {
      // All computeds are methods
      desc.kind = 'method';
      desc.placement = 'prototype';

      desc.finisher = function initializeComputedProperty(target) {
        let { prototype } = target;
        let { key } = desc;

        assert(
          `ES6 property getters/setters only need to be decorated once, '${key}' was decorated on both the getter and the setter`,
          !computedDescriptorFor(prototype, key)
        );

        let computedDesc = buildComputedDesc(dec, desc);

        if (!HAS_NATIVE_COMPUTED_GETTERS) {
          // Until recent versions of Ember, computed properties would be defined
          // by just setting them. We need to blow away any predefined properties
          // (getters/setters, etc.) to allow Ember.defineProperty to work correctly.
          Object.defineProperty(prototype, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: undefined,
          });
        }

        defineProperty(prototype, key, computedDesc);

        if (NEEDS_STAGE_1_DECORATORS) {
          // There's currently no way to disable redefining the property when decorators
          // are run, so return the property descriptor we just assigned
          desc.descriptor = Object.getOwnPropertyDescriptor(prototype, key);
        }

        return target;
      };

      return desc;
    });

    Object.setPrototypeOf(dec, DecoratorDescriptor.prototype);

    if (DEBUG) {
      // This is for wrapComputed to check against invalid input
      dec.__isComputedDecorator = true;
    }

    DECORATOR_COMPUTED_FN.set(dec, fn);
    DECORATOR_PARAMS.set(dec, params);

    return dec;
  };
}

export function computedDecoratorWithParams(fn) {
  return function(...params) {
    if (isFieldDescriptor(params)) {
      // Funkiness of application call here is due to `...params` transpiling to
      // use `apply`, which is no longer on the prototype of the computedDecorator
      // since it has had it's prototype changed :upside_down_face:
      return Function.apply.call(computedDecorator(fn), undefined, params);
    } else {
      return computedDecorator(fn, params);
    }
  };
}

export function computedDecoratorWithRequiredParams(fn, name) {
  return function(...params) {
    assert(
      `The @${name || fn.name} decorator requires parameters`,
      !isFieldDescriptor(params) && params.length > 0
    );

    return computedDecorator(fn, params);
  };
}
