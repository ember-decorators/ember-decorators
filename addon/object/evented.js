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
 * import Component from '@ember/component';
 * import { on } from 'ember-decorators/object/evented';
 *
 * export default class EventDemoComponent extends Component
 *   @on('init')
 *   setupStuff() {
 *     //...
 *   }
 * }
 * ```
 *
 * @function
 * @param {...String} eventNames - Names of the events that trigger the function
 */
export const on = decoratorWithRequiredParams(Ember.on);
