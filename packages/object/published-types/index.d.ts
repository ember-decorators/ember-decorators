// TypeScript Version: 2.8

import ComputedProperty from '@ember/object/computed';

type ComputedDecorator<Get, Set = Get> = ComputedProperty<Get, Set> & PropertyDecorator;

type ComputedPropertyGetterFunction<T> = (this: any, key: string) => T;

interface ComputedPropertyGet<T> {
    get(this: any, key: string): T;
}

interface ComputedPropertySet<T> {
    set(this: any, key: string, value: T): T;
}

type ComputedPropertyDesc<T> =
    | ComputedPropertyGetterFunction<T>
    | ComputedPropertyGet<T>
    | ComputedPropertySet<T>
    | (ComputedPropertyGet<T> & ComputedPropertySet<T>);

/**
  Decorator that turns the target function into an Action

  Adds an `actions` object to the target object and creates a passthrough
  function that calls the original. This means the function still exists
  on the original object, and can be used directly.

  ```js
  export default class ActionDemoComponent extends Component {
    @action
    foo() {
      // do something
    }
  }
  ```

  ```hbs
  <!-- template.hbs -->
  <button onclick={{action "foo"}}>Execute foo action</button>
  ```

  Also binds the function directly to the instance, so it can be used in any
  context:

  ```hbs
  <!-- template.hbs -->
  <button onclick={{this.foo}}>Execute foo action</button>
  ```

  @function
  @return {Function}
*/
export const action: MethodDecorator;

/**
  Decorator that turns a native getter/setter into a computed property. Note
  that though they use getters and setters, you must still use the Ember `get`/
  `set` functions to get and set their values.

  ```js
  import Component from '@ember/component';
  import { computed } from '@ember-decorators/object';

  export default class UserProfileComponent extends Component {
    first = 'Bruce';
    last = 'Wayne';

    @computed('first', 'last')
    get name() {
      return `${this.first} ${this.last}`; // => 'Bruce Wayne'
    }

    set name(value) {
      if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
        throw new TypeError('Invalid name');
      }

      const [first, last] = value.split(' ');
      this.setProperties({ first, last });
    }
  }
  ```

  Can also be optionally passed a computed property descriptor (e.g. a function
  or an object with `get` and `set` functions on it):

  ```js
  let fullNameComputed = computed('firstName', 'lastName', {
    get() {
      return `${this.first} ${this.last}`; // => 'Diana Prince'
    },

    set(key, value) {
      if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
        throw new TypeError('Invalid name');
      }

      const [first, last] = value.split(' ');
      this.setProperties({ first, last });

      return value;
    }
  })

  export default class UserProfileComponent extends Component {
    first = 'Diana';
    last = 'Prince';

    @fullNameComputed fullName;
  }
  ```

  @function
  @param {...string} propertyNames - List of property keys this computed is dependent on
  @return {ComputedProperty}
*/
export const computed: {
  <T>(cb?: ComputedPropertyDesc<T>): ComputedDecorator<T>;
  <T>(k1: string, cb?: ComputedPropertyDesc<T>): ComputedDecorator<T>;
  <T>(
      k1: string,
      k2: string,
      cb?: ComputedPropertyDesc<T>
  ): ComputedDecorator<T>;
  <T>(
      k1: string,
      k2: string,
      k3: string,
      cb?: ComputedPropertyDesc<T>
  ): ComputedDecorator<T>;
  <T>(
      k1: string,
      k2: string,
      k3: string,
      k4: string,
      cb?: ComputedPropertyDesc<T>
  ): ComputedDecorator<T>;
  <T>(
      k1: string,
      k2: string,
      k3: string,
      k4: string,
      k5: string,
      cb?: ComputedPropertyDesc<T>
  ): ComputedDecorator<T>;
  <T>(
      k1: string,
      k2: string,
      k3: string,
      k4: string,
      k5: string,
      k6: string,
      cb?: ComputedPropertyDesc<T>
  ): ComputedDecorator<T>;
  (
      k1: string,
      k2: string,
      k3: string,
      k4: string,
      k5: string,
      k6: string,
      k7: string,
      ...rest: any[]
  ): ComputedDecorator<any>;
  (
    target: any,
    key: any,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor;
}

/**
  Triggers the target function when the dependent properties have changed

  ```javascript
  import { observes } from '@ember-decorators/object';

  class Foo {
    @observes('foo')
    bar() {
      //...
    }
  }
  ```

  @function
  @param {...String} propertyNames - Names of the properties that trigger the function
 */
export function observes(...propertyNames: string[]): MethodDecorator;

/**
  Removes observers from the target function.

  ```javascript
  import { observes, unobserves } from '@ember-decorators/object';

  class Foo {
    @observes('foo')
    bar() {
      //...
    }
  }

  class Bar extends Foo {
    @unobserves('foo') bar;
  }
  ```

  @function
  @param {...String} propertyNames - Names of the properties that no longer trigger the function
 */
export function unobserves(...propertyNames: string[]): PropertyDecorator & MethodDecorator;

/**
  Adds an event listener to the target function.

  ```javascript
  import { on } from '@ember-decorators/object';

  class Foo {
    @on('fooEvent', 'barEvent')
    bar() {
      //...
    }
  }
  ```

  @function
  @param {...String} eventNames - Names of the events that trigger the function
 */
export function on(...eventNames: string[]): MethodDecorator;

/**
  Removes an event listener from the target function.

  ```javascript
  import { on, off } from '@ember-decorators/object';

  class Foo {
    @on('fooEvent', 'barEvent')
    bar() {
      //...
    }
  }

  class Bar extends Foo {
    @off('fooEvent', 'barEvent') bar;
  }
  ```

  @function
  @param {...String} eventNames - Names of the events that no longer trigger the function
 */
export function off(...eventNames: string[]): PropertyDecorator & MethodDecorator;

// Prevent automatic exports of internal types
export {}
