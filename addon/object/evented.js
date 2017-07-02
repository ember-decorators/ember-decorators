import Ember from 'ember';

import {
  decoratorWithRequiredParams
} from '../utils/decorator-macros';


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
export const on = decoratorWithRequiredParams(Ember.on, 'Cannot `on` without event names');

