/**
 * Decorator that turns the target function into an Action
 *
 * Adds an `actions` object to the target object and creates a passthrough
 * function that calls the original. This means the function still exists
 * on the original object, and can be used directly.
 *
 * ```js
 * import Component from '@ember/component';
 * import { action } from 'ember-decorators/object';
 *
 * export default class ActionDemoComponent extends Component {
 *   @action
 *   foo() {
 *     // do something
 *   }
 * }
 * ```
 *
 * ```hbs
 * <button onclick={{action "foo"}}>Execute foo action</button>
 * ```
 */
export const action: MethodDecorator;

/**
 * Decorator that turns a function into a computed property. The decorators should
 * be applied to native getter and setter functions. Note that though they use getters
 * and setters, you must still use the Ember `get`/`set` functions to get and set their
 * values.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class UserProfileComponent extends Component {
 *   first = 'John';
 *   last = 'Smith';
 *
 *   @computed('first', 'last')
 *   get name() {
 *     const first = this.get('first');
 *     const last = this.get('last');
 *
 *     return `${first} ${last}`; // => 'John Smith'
 *   }
 *
 *   set name(value) {
 *     if (typeof value !== 'string' || !value.test(/^[a-z]+ [a-z]+$/i)) {
 *       throw new TypeError('Invalid name');
 *     }
 *
 *     const [first, last] = value.split(' ');
 *     this.setProperties({ first, last });
 *
 *     return value;
 *   }
 * }
 * ```
 *
 * @function
 * @param {...String} propertyNames - List of property keys this computed is dependent on
 */
export function computed(...propertyNames: string[]): MethodDecorator;
export function computed(
  target: any,
  key: any,
  descriptor: PropertyDescriptor
): PropertyDescriptor;

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
export function unobserves(...propertyNames: string[]): PropertyDecorator;

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
export function off(...eventNames: string[]): PropertyDecorator;

/**
 * Decorator that modifies a computed property to be read only.
 *
 * Usage:
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { computed, readOnly } from 'ember-decorators/object';
 *
 * export default class extends Component {
 *   @readOnly
 *   @computed('first', 'last')
 *   name(first, last) {
 *     return `${first} ${last}`;
 *   }
 * }
 * ```
 *
 * @return {ComputedProperty}
 */
export const readOnly: MethodDecorator;

/**
 * Decorator that modifies a computed property to be volatile.
 *
 * ```js
 * import Component from '@ember/component';
 * import { computed, readOnly } from 'ember-decorators/object';
 *
 * export default class extends Component {
 *   @volatile
 *   @computed('first', 'last')
 *   name(first, last) {
 *     return `${first} ${last}`;
 *   }
 * }
 * ```
 *
 * @return {ComputedProperty}
*/
export const volatile: MethodDecorator;
