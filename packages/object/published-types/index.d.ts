// TypeScript Version: 2.8

interface ObserverDefinition {
  dependentKeys: string[];
  sync: boolean;
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
  Triggers the target function when the dependent properties have changed

  ```javascript
  import EmberObject from '@ember/object';
  import { observes } from '@ember-decorators/object';

  class Foo extends EmberObject {
    @observes({
      dependentKeys: ['foo'],
      sync: false,
    })
    bar() {
      //...
    }
  }
  ```

  @function
  @param {Object} definition - ObserverDefinition
  @param {Array<String>} [definition.dependentKeys] - Names of the properties that trigger the function
  @param {boolean} [definition.sync] - Whether the observer should fire synchronously or asynchronously
 */
export function observes(definition: ObserverDefinition): MethodDecorator;

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
export {};
