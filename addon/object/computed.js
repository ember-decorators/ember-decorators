import Ember from 'ember';

import {
  decoratedPropertyWithRequiredParams
} from '../utils/decorator-macros';

/**
 * Decorator that wraps [Ember.computed.alias](http://emberjs.com/api/classes/Ember.computed.html#method_alias)
 *
 * Creates a new property that is an alias for another property on an object.
 * Calls to get or set this property behave as though they were called on
 * the original property.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { alias } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   person: {
 *     first: 'Joe'
 *   },
 *
 *   @alias('person.first') firstName
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the aliased property
 */
export const alias = decoratedPropertyWithRequiredParams(Ember.computed.alias);

/**
 * Decorator that wraps [Ember.computed.and](http://emberjs.com/api/classes/Ember.computed.html#method_and)
 *
 * A computed property that performs a logical and on the original values
 * for the provided dependent properties.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { and } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   person: {
 *     first: 'Joe'
 *   },
 *
 *   @and('first', 'last') hasFullName // false
 * });
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys for properties to `and`
 */
export const and = decoratedPropertyWithRequiredParams(Ember.computed.and);

/**
 * Decorator that wraps [Ember.computed.bool](http://emberjs.com/api/classes/Ember.computed.html#method_bool)
 *
 * A computed property that converts the provided dependent property into a
 * boolean value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { bool } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   messageCount: 1,
 *
 *   @bool('messageCount') hasMessages // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to convert
 */
export const bool = decoratedPropertyWithRequiredParams(Ember.computed.bool);

/**
 * Decorator that wraps [Ember.computed.collect](http://emberjs.com/api/classes/Ember.computed.html#method_collect)
 *
 * A computed property that returns the array of values for the provided
 * dependent properties.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { collect } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   light: 'strobe',
 *   lens: '35mm prime',
 *
 *   @collect('light', 'lens') equipment // ['strobe', '35mm prime']
 * });
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys for the properties to collect
 */
export const collect = decoratedPropertyWithRequiredParams(Ember.computed.collect);

/**
 * Decorator that wraps [Ember.computed.empty](http://emberjs.com/api/classes/Ember.computed.html#method_empty)
 *
 * A computed property that returns `true` if the value of the dependent
 * property is null, an empty string, empty array, or empty function.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { empty } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   items: Ember.A(['taco', 'burrito']),
 *
 *   @empty('items') isEmpty // false
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the property to check emptiness of
 */
export const empty = decoratedPropertyWithRequiredParams(Ember.computed.empty);

/**
 * Decorator that wraps [Ember.computed.equal](http://emberjs.com/api/classes/Ember.computed.html#method_equal)
 *
 * A computed property that returns true if the dependent properties are equal.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { equal } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   state: 'sleepy',
 *
 *   @equal('state', 'sleepy') napTime // true
 * });
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 * @param {Any} value - Value to compare the dependent property to
 */
export const equal = decoratedPropertyWithRequiredParams(Ember.computed.equal);

/**
 * Decorator that wraps [Ember.computed.filter](http://emberjs.com/api/classes/Ember.computed.html#method_filter)
 *
 * Filters the items in the array by the provided callback.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { filter } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   chores: Ember.A([
 *     { name: 'cook', done: true },
 *     { name: 'clean', done: true },
 *     { name: 'write more unit tests', done: false }
 *   ]),
 *
 *   @filter('chores', function(chore, index, array) {
 *     return !chore.done;
 *   }) remainingChores // [{name: 'write more unit tests', done: false}]
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to filter
 * @param {Function(item: Any, index: Number, array: Array<Any>): Boolean} callback - The function to filter with
 */
export const filter = decoratedPropertyWithRequiredParams(Ember.computed.filter);

/**
 * Decorator that wraps [Ember.computed.filterBy](http://emberjs.com/api/classes/Ember.computed.html#method_filterBy)
 *
 * Filters the array by the property and value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { filterBy } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   chores: Ember.A([
 *     { name: 'cook', done: true },
 *     { name: 'clean', done: true },
 *     { name: 'write more unit tests', done: false }
 *   ]),
 *
 *   @filterBy('chores', 'done', false) remainingChores // [{name: 'write more unit tests', done: false}]
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to filter
 * @param {String} propertyKey - Property of the array items to filter by
 * @param {Any} value - Value to filter by
 */
export const filterBy = decoratedPropertyWithRequiredParams(Ember.computed.filterBy);

/**
 * Decorator that wraps [Ember.computed.gt](http://emberjs.com/api/classes/Ember.computed.html#method_gt)
 *
 * A computed property that returns `true` if the provided dependent property
 * is greater than the provided value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { gt } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   totalCats: 11,
 *
 *   @gt('totalCats', 10) isCatParty // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export const gt = decoratedPropertyWithRequiredParams(Ember.computed.gt);

/**
 * Decorator that wraps [Ember.computed.gte](http://emberjs.com/api/classes/Ember.computed.html#method_gte)
 *
 * A computed property that returns `true` if the provided dependent property
 * is greater than or equal to the provided value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { gte } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   totalPlayers: 14,
 *
 *   @gte('totalPlayers', 14) hasEnoughPlayers // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export const gte = decoratedPropertyWithRequiredParams(Ember.computed.gte);

/**
 * Decorator that wraps [Ember.computed.intersect](http://emberjs.com/api/classes/Ember.computed.html#method_intersect)
 *
 * A computed property which returns a new array with all the duplicated
 * elements from two or more dependent arrays.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { intersect } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
 *   foods: Ember.A(['tacos', 'pizza']),
 *
 *   @intersect('likes', 'foods') favoriteFoods // ['tacos', 'pizza']
 * });
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys of the arrays to intersect
 */
export const intersect = decoratedPropertyWithRequiredParams(Ember.computed.intersect);

/**
 * Decorator that wraps [Ember.computed.lt](http://emberjs.com/api/classes/Ember.computed.html#method_lt)
 *
 * A computed property that returns `true` if the provided dependent property
 * is less than the provided value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { lt } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   totalDogs: 3,
 *
 *   @lt('totalDogs', 10) isDogParty // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export const lt = decoratedPropertyWithRequiredParams(Ember.computed.lt);

/**
 * Decorator that wraps [Ember.computed.lte](http://emberjs.com/api/classes/Ember.computed.html#method_lte)
 *
 * A computed property that returns `true` if the provided dependent property
 * is less than or equal to the provided value.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { lte } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   totalPlayers: 14,
 *
 *   @lte('totalPlayers', 14) hasEnoughPlayers // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export const lte = decoratedPropertyWithRequiredParams(Ember.computed.lte);

/**
 * Decorator that wraps [Ember.computed.map](http://emberjs.com/api/classes/Ember.computed.html#method_map)
 *
 * Returns an array mapped via the callback
 *
 * ```javascript
 * import Ember from 'ember';
 * import { map } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   chores: Ember.A(['clean', 'write more unit tests']),
 *
 *   @map('chores', function(chore, index) {
 *     return chore.toUpperCase() + '!';
 *   }) loudChores // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to map over
 * @param {Function(item: Any, index: Number): Any} callback - Function to map over the array
 */
export const map = decoratedPropertyWithRequiredParams(Ember.computed.map);

/**
 * Decorator that wraps [Ember.computed.mapBy](http://emberjs.com/api/classes/Ember.computed.html#method_mapBy)
 *
 * Returns an array mapped to the specified key.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { mapBy } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   people: Ember.A([
 *     {name: "George", age: 5},
 *     {name: "Stella", age: 10},
 *     {name: "Violet", age: 7}
 *   ]),
 *
 *   @mapBy('people', 'age') ages // [5, 10, 7]
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to map over
 * @param {String} propertyKey - Property of the array items to map by
 */
export const mapBy = decoratedPropertyWithRequiredParams(Ember.computed.mapBy);

/**
 * Decorator that wraps [Ember.computed.match](http://emberjs.com/api/classes/Ember.computed.html#method_match)
 *
 * A computed property which matches the original value for the dependent
 * property against a given RegExp, returning `true` if they values matches
 * the RegExp and `false` if it does not.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { match } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   email: 'tomster@emberjs.com',
 *
 *   @match('email', /^.+@.+\..+$/) validEmail
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - The property to match
 * @param {RegExp} pattern - The pattern to match against
 */
export const match = decoratedPropertyWithRequiredParams(Ember.computed.match);

/**
 * Decorator that wraps [Ember.computed.max](http://emberjs.com/api/classes/Ember.computed.html#method_max)
 *
 * A computed property that calculates the maximum value in the dependent
 * array. This will return `-Infinity` when the dependent array is empty.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { max } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   values: Ember.A([1, 2, 5, 10]),
 *
 *   @max('values') maxValue // 10
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to find the max value of
 */
export const max = decoratedPropertyWithRequiredParams(Ember.computed.max);

/**
 * Decorator that wraps [Ember.computed.min](http://emberjs.com/api/classes/Ember.computed.html#method_min)
 *
 * A computed property that calculates the minimum value in the dependent
 * array. This will return `Infinity` when the dependent array is empty.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { min } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   values: Ember.A([1, 2, 5, 10]),
 *
 *   @min('values') minValue // 1
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to find the max value of
 */
export const min = decoratedPropertyWithRequiredParams(Ember.computed.min);

/**
 * Decorator that wraps [Ember.computed.none](http://emberjs.com/api/classes/Ember.computed.html#method_none)
 *
 * A computed property that returns true if the value of the dependent property
 * is null or undefined. This avoids errors from JSLint complaining about use
 * of `==`, which can be technically confusing.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { none } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   firstName: null,
 *
 *   @none('firstName') isNameless // true until firstName is defined
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 */
export const none = decoratedPropertyWithRequiredParams(Ember.computed.none);

/**
 * Decorator that wraps [Ember.computed.not](http://emberjs.com/api/classes/Ember.computed.html#method_not)
 *
 * A computed property that returns the inverse boolean value of the original
 * value for the dependent property.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { not } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   loggedIn: false,
 *
 *   @not('loggedIn') isAnonymous // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to `not`
 */
export const not = decoratedPropertyWithRequiredParams(Ember.computed.not);

/**
 * Decorator that wraps [Ember.computed.notEmpty](http://emberjs.com/api/classes/Ember.computed.html#method_notEmpty)
 *
 * A computed property that returns `true` if the value of the dependent
 * property is NOT null, an empty string, empty array, or empty function.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { notEmpty } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   groceryBag: Ember.A(['milk', 'eggs', 'apples']),
 *
 *   @notEmpty('groceryBag') hasGroceriesToPutAway // true
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 */
export const notEmpty = decoratedPropertyWithRequiredParams(Ember.computed.notEmpty);

/**
 * Decorator that wraps [Ember.computed.oneWay](http://emberjs.com/api/classes/Ember.computed.html#method_oneWay)
 *
 * Where `computed.alias` aliases `get` and `set`, and allows for bidirectional
 * data flow, `computed.oneWay` only provides an aliased `get`. The `set` will
 * not mutate the upstream property, rather causes the current property to
 * become the value set. This causes the downstream property to permanently
 * diverge from the upstream property.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { oneWay } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   firstName: 'Joe',
 *
 *   @oneWay('firstName') originalName // will always be 'Joe'
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to alias
 */
export const oneWay = decoratedPropertyWithRequiredParams(Ember.computed.oneWay);

/**
 * Decorator that wraps [Ember.computed.or](http://emberjs.com/api/classes/Ember.computed.html#method_or)
 *
 * A computed property which performs a logical or on the original values for
 * the provided dependent properties.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { or } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   hasJacket: true,
 *   hasUmbrella: false,
 *
 *   @or('hasJacket', 'hasUmbrella') isReadyForRain // true
 * });
 * ```
 *
 * @function
 * @param {...String} dependentKey - Key for the properties to `or`
 */
export const or = decoratedPropertyWithRequiredParams(Ember.computed.or);

/**
 * Decorator that wraps [Ember.computed.reads](http://emberjs.com/api/classes/Ember.computed.html#method_reads)
 *
 * This is a more semantically meaningful alias of `computed.oneWay`, whose
 * name is somewhat ambiguous as to which direction the data flows.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { reads } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   @reads('first') firstName
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to read
 */
export const reads = decoratedPropertyWithRequiredParams(Ember.computed.reads);

/**
 * Decorator that wraps [Ember.computed.setDiff](http://emberjs.com/api/classes/Ember.computed.html#method_setDiff)
 *
 * A computed property which returns a new array with all the properties from
 * the first dependent array that are not in the second dependent array.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { setDiff } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
 *   foods: Ember.A(['tacos', 'pizza']),
 *
 *   @setDiff('likes', 'foods') favoriteThingsThatArentFood // ['puppies']
 * });
 * ```
 *
 * @function
 * @param {String} setAProperty - Keys for the first set
 * @param {String} setBProperty - Keys for the first set
 */
export const setDiff = decoratedPropertyWithRequiredParams(Ember.computed.setDiff);

/**
 * Decorator that wraps [Ember.computed.sort](http://emberjs.com/api/classes/Ember.computed.html#method_sort)
 *
 * A computed property which returns a new array with all the properties from
 * the first dependent array sorted based on a property or sort function.
 *
 *
 * The callback method you provide should have the following signature:
 *
 * ```javascript
 * function(itemA, itemB);
 * ```
 * - `itemA` the first item to compare.
 * - `itemB` the second item to compare.
 *
 * This function should return negative number (e.g. `-1`) when `itemA` should
 * come before `itemB`. It should return positive number (e.g. `1`) when
 * `itemA` should come after `itemB`. If the `itemA` and `itemB` are equal this
 * function should return `0`.
 *
 * Therefore, if this function is comparing some numeric values, simple
 * `itemA - itemB` or `itemA.get( 'foo' ) - itemB.get( 'foo' )` can be used
 * instead of series of `if`.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { sort } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   this.names = Ember.A([{name:'Link'},{name:'Zelda'},{name:'Ganon'},{name:'Navi'}]);
 *   @sort('names', function(a, b){
 *     if (a.name > b.name) {
 *       return 1;
 *     } else if (a.name < b.name) {
 *       return -1;
 *     }
 *
 *     return 0;
 *   }) sortedNames // [{name:'Ganon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - The key for the array that should be sorted
 * @param {Array<String>|Function(Any, Any): Number} sortDefinition - Sorting function or sort descriptor
 */
export const sort = decoratedPropertyWithRequiredParams(Ember.computed.sort);

/**
 * Decorator that wraps [Ember.computed.sum](http://emberjs.com/api/classes/Ember.computed.html#method_sum)
 *
 * A computed property that returns the sum of the value in the dependent
 * array.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { sum } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   values: Ember.A([1, 2, 3]),
 *
 *   @sum('values') total // 6
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the array to sum up
 */
export const sum = decoratedPropertyWithRequiredParams(Ember.computed.sum);

/**
 * Decorator that wraps [Ember.computed.union](http://emberjs.com/api/classes/Ember.computed.html#method_union)
 *
 * Alias for [union](http://emberjs.com/api/classes/Ember.computed.html#method_uniq).
 *
 * ```javascript
 * import Ember from 'ember';
 * import { union } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
 *   foods: Ember.A(['tacos', 'pizza', 'ramen']),
 *
 *   @union('likes', 'foods') favorites // ['tacos', 'puppies', 'pizza', 'ramen']
 * });
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys of the arrays to union
 */
export const union = decoratedPropertyWithRequiredParams(Ember.computed.union);

/**
 * Decorator that wraps [Ember.computed.uniq](http://emberjs.com/api/classes/Ember.computed.html#method_uniq)
 *
 * A computed property which returns a new array with all the unique elements from one or more dependent arrays.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { uniq } from 'ember-decorators/object/computed';
 *
 * export default Ember.Component.extend({
 *   likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
 *   foods: Ember.A(['tacos', 'pizza', 'ramen']),
 *
 *   @uniq('likes', 'foods') favorites // ['tacos', 'puppies', 'pizza', 'ramen']
 * });
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the array to uniq
 */
export const uniq = decoratedPropertyWithRequiredParams(Ember.computed.uniq);
