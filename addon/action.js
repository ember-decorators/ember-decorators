import { decorator } from './utils/decorator-wrappers';
import extractValue from './utils/extract-value';

/**
 * Decorator that turns the target function into an Action
 *
 * Adds an `actions` object to the target object and creates a passthrough
 * function that calls the original. This means the function still exists
 * on the original object, and can be used directly.
 *
 * Before:
 *
 * ```js
 * export default Ember.Component.extend({
 *   actions: {
 *     foo() {
 *       // do something
 *     }
 *   }
 * });
 * ```
 *
 * After:
 *
 * ```js
 * export default MyComponent extends Ember.Component {
 *   @action
 *   foo() {
 *     // do something
 *   }
 * }
 * ```
 */
export default decorator(function(target, key, desc) {
  const value = extractValue(desc);

  if (typeof value !== 'function') {
    throw new Error('The @action decorator must be applied to functions');
  }

  target.actions = target.actions || {};
  target.actions[key] = value;

  return value;
});
