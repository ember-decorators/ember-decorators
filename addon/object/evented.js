import Ember from 'ember';

import {
  decoratorWithRequiredParams
} from '../utils/decorator-macros';

import { observerOrEventedDecorator } from '../utils/observer-and-evented-macros';

/**
 * Class decorator that makes an ES class capable of listening to events. Used with
 * the `on` decorator to trigger functions when events occur.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { evented, on } from 'ember-decorators/object/evented';
 *
 * @evented
 * export default class extends Ember.Component {
 *   @on('init')
 *   setupStuff() {
 *     //...
 *   }
 * }
 * ```
 *
 * @function
 */
export const evented = observerOrEventedDecorator('evented');

/**
 * Decorator that wraps [Ember.on](https://emberjs.com/api/#method_on)
 *
 * Triggers the target function on events
 *
 * ```javascript
 * import Ember from 'ember';
 * import { on } from 'ember-decorators/object/evented';
 *
 * export default Ember.Component.extend({
 *   @on('init')
 *   setupStuff() {
 *     //...
 *   }
 * });
 * ```
 *
 * @function
 * @param {...String} eventNames - Names of the events that trigger the function
 */
export const on = decoratorWithRequiredParams(Ember.on);
