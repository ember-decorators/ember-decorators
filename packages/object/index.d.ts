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
 * @function
 */
export const readOnly: MethodDecorator;
