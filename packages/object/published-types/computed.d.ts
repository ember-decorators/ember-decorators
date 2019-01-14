import ComputedProperty from '@ember/object/computed';

type ComputedDecorator<Get, Set = Get> = ComputedProperty<Get, Set> & PropertyDecorator;

/**
 * Decorator that wraps [Ember.computed.alias](http://emberjs.com/api/classes/Ember.computed.html#method_alias)
 *
 * Creates a new property that is an alias for another property on an object.
 * Calls to get or set this property behave as though they were called on
 * the original property.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { alias } from 'ember-decorators/object/computed';
 *
 * export default class UserProfileComponent extends Component {
 *   person = {
 *     first: 'Joe'
 *   };
 *
 *   @alias('person.first') firstName;
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the aliased property
 */
export function alias(dependentKey: string): ComputedDecorator<any>;
/**
 * Decorator that wraps [Ember.computed.and](http://emberjs.com/api/classes/Ember.computed.html#method_and)
 *
 * A computed property that performs a logical and on the original values
 * for the provided dependent properties.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { and } from 'ember-decorators/object/computed';
 *
 * export default class UserProfileComponent extends Component {
 *   person = {
 *     first: 'Joe'
 *   };
 *
 *   @and('person.{first,last}') hasFullName; // false
 * }
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys for properties to `and`
 */
export function and(...dependentKeys: string[]): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.bool](http://emberjs.com/api/classes/Ember.computed.html#method_bool)
 *
 * A computed property that converts the provided dependent property into a
 * boolean value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { bool } from 'ember-decorators/object/computed';
 *
 * export default class MessagesNotificationComponent extends Component {
 *   messageCount = 1;
 *
 *   @bool('messageCount') hasMessages; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to convert
 */
export function bool(dependentKey: string): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.collect](http://emberjs.com/api/classes/Ember.computed.html#method_collect)
 *
 * A computed property that returns the array of values for the provided
 * dependent properties.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { collect } from 'ember-decorators/object/computed';
 *
 * export default class CameraEquipmentComponent extends Component {
 *   light = 'strobe';
 *   lens = '35mm prime';
 *
 *   @collect('light', 'lens') equipment; // ['strobe', '35mm prime']
 * }
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys for the properties to collect
 */
export function collect(...dependentKeys: string[]): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.deprecatingAlias](http://emberjs.com/api/classes/Ember.computed.html#method_deprecatingAlias)
 *
 * Creates a new property that is an alias for another property on an object.
 * Calls to get or set this property behave as though they were called on
 * the original property, but will also trigger a deprecation warning.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { deprecatingAlias } from 'ember-decorators/object/computed';
 *
 * export default class UserProfileComponent extends {
 *   person = {
 *     first: 'Joe'
 *   };
 *
 *   @deprecatingAlias('person.first', {
 *     id: 'user-profile.firstName',
 *     until: '3.0.0',
 *     url: 'https://example.com/deprecations/user-profile.firstName'
 *   }) firstName;
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to alias
 * @param {Object} options
 */
export function deprecatingAlias(dependentKey: string): ComputedDecorator<any>;
/**
 * Decorator that wraps [Ember.computed.empty](http://emberjs.com/api/classes/Ember.computed.html#method_empty)
 *
 * A computed property that returns `true` if the value of the dependent
 * property is null, an empty string, empty array, or empty function.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { empty } from 'ember-decorators/object/computed';
 *
 * export default class FoodItemsComponent extends Component {
 *   items = A(['taco', 'burrito']);
 *
 *   @empty('items') isEmpty; // false
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the property to check emptiness of
 */
export function empty(dependentKey: string): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.equal](http://emberjs.com/api/classes/Ember.computed.html#method_equal)
 *
 * A computed property that returns true if the dependent properties are equal.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { equal } from 'ember-decorators/object/computed';
 *
 * export default class NapTimeComponent extends Component {
 *   state = 'sleepy';
 *
 *   @equal('state', 'sleepy') napTime; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 * @param {Any} value - Value to compare the dependent property to
 */
export function equal(dependentKey: string, value: any): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.filter](http://emberjs.com/api/classes/Ember.computed.html#method_filter)
 *
 * Filters the items in the array by the provided callback.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { filter } from 'ember-decorators/object/computed';
 *
 * export default class ChoresListComponent extends Component {
 *   chores = A([
 *     { name: 'cook', done: true },
 *     { name: 'clean', done: true },
 *     { name: 'write more unit tests', done: false }
 *   ]);
 *
 *   @filter('chores')
 *   remainingChores(chore, index, array) {
 *     return !chore.done;
 *   } // [{name: 'write more unit tests', done: false}]
 *
 *   // alternative syntax:
 *
 *   @filter('chores', function(chore, index, array) {
 *     return !chore.done;
 *   }) remainingChores; // [{name: 'write more unit tests', done: false}]
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to filter
 * @param {Function(item: Any, index: Number, array: Array<Any>): Boolean} callback - The function to filter with
 */
export function filter<T>(
  dependentKey: string,
  callback?: (item: T, index: number, array: T[]) => boolean
): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.filterBy](http://emberjs.com/api/classes/Ember.computed.html#method_filterBy)
 *
 * Filters the array by the property and value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { filterBy } from 'ember-decorators/object/computed';
 *
 * export default class ChoresListComponent extends Component {
 *   chores = A([
 *     { name: 'cook', done: true },
 *     { name: 'clean', done: true },
 *     { name: 'write more unit tests', done: false }
 *   ]);
 *
 *   @filterBy('chores', 'done', false) remainingChores; // [{name: 'write more unit tests', done: false}]
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to filter
 * @param {String} propertyKey - Property of the array items to filter by
 * @param {Any} value - Value to filter by
 */
export function filterBy(
  dependentKey: string,
  propertyKey: string,
  value?: any
): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.gt](http://emberjs.com/api/classes/Ember.computed.html#method_gt)
 *
 * A computed property that returns `true` if the provided dependent property
 * is greater than the provided value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { gt } from 'ember-decorators/object/computed';
 *
 * export default class CatPartyComponent extends Component {
 *   totalCats = 11;
 *
 *   @gt('totalCats', 10) isCatParty; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export function gt(dependentKey: string, value: number): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.gte](http://emberjs.com/api/classes/Ember.computed.html#method_gte)
 *
 * A computed property that returns `true` if the provided dependent property
 * is greater than or equal to the provided value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { gte } from 'ember-decorators/object/computed';
 *
 * export default class PlayerListComponent extends Component {
 *   totalPlayers = 14;
 *
 *   @gte('totalPlayers', 14) hasEnoughPlayers; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export function gte(dependentKey: string, value: number): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.intersect](http://emberjs.com/api/classes/Ember.computed.html#method_intersect)
 *
 * A computed property which returns a new array with all the duplicated
 * elements from two or more dependent arrays.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { intersect } from 'ember-decorators/object/computed';
 *
 * export default class FoodListComponent extends Component {
 *   likes = A([ 'tacos', 'puppies', 'pizza' ]);
 *   foods = A(['tacos', 'pizza']);
 *
 *   @intersect('likes', 'foods') favoriteFoods; // ['tacos', 'pizza']
 * }
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys of the arrays to intersect
 */
export function intersect(...dependentKeys: string[]): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.lt](http://emberjs.com/api/classes/Ember.computed.html#method_lt)
 *
 * A computed property that returns `true` if the provided dependent property
 * is less than the provided value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { lt } from 'ember-decorators/object/computed';
 *
 * export default class DogPartyComponent extends Component {
 *   totalDogs = 3;
 *
 *   @lt('totalDogs', 10) isDogParty; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export function lt(dependentKey: string, value: number): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.lte](http://emberjs.com/api/classes/Ember.computed.html#method_lte)
 *
 * A computed property that returns `true` if the provided dependent property
 * is less than or equal to the provided value.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { lte } from 'ember-decorators/object/computed';
 *
 * export default class PlayerListComponent extends Component {
 *   totalPlayers = 14;
 *
 *   @lte('totalPlayers', 14) hasEnoughPlayers; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to compare
 * @param {Number} value - Value to compare against
 */
export function lte(dependentKey: string, value: number): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.map](http://emberjs.com/api/classes/Ember.computed.html#method_map)
 *
 * Returns an array mapped via the callback
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { map } from 'ember-decorators/object/computed';
 *
 * export default class ChoresListComponent extends Component {
 *   chores = A(['clean', 'write more unit tests']);
 *
 *   @map('chores')
 *   loudChores(chore, index) {
 *     return chore.toUpperCase() + '!';
 *   } // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
 *
 *   // alternative syntax:
 *
 *   @map('chores', function(chore, index) {
 *     return chore.toUpperCase() + '!';
 *   }) loudChores; // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to map over
 * @param {Function(item: Any, index: Number): Any} callback - Function to map over the array
 */
export function map(
  dependentKey: string,
  callback?: (item: any, index: number) => any
): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.mapBy](http://emberjs.com/api/classes/Ember.computed.html#method_mapBy)
 *
 * Returns an array mapped to the specified key.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { mapBy } from 'ember-decorators/object/computed';
 *
 * export default class PeopleListComponent extends Component {
 *   people = A([
 *     {name: "George", age: 5},
 *     {name: "Stella", age: 10},
 *     {name: "Violet", age: 7}
 *   ]);
 *
 *   @mapBy('people', 'age') ages; // [5, 10, 7]
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to map over
 * @param {String} propertyKey - Property of the array items to map by
 */
export function mapBy(
  dependentKey: string,
  propertyKey: string
): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.match](http://emberjs.com/api/classes/Ember.computed.html#method_match)
 *
 * A computed property which matches the original value for the dependent
 * property against a given RegExp, returning `true` if they values matches
 * the RegExp and `false` if it does not.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { match } from 'ember-decorators/object/computed';
 *
 * export default class IsEmailValidComponent extends Component {
 *   email = 'tomster@emberjs.com';
 *
 *   @match('email', /^.+@.+\..+$/) validEmail;
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - The property to match
 * @param {RegExp} pattern - The pattern to match against
 */
export function match(dependentKey: string, pattern: RegExp): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.max](http://emberjs.com/api/classes/Ember.computed.html#method_max)
 *
 * A computed property that calculates the maximum value in the dependent
 * array. This will return `-Infinity` when the dependent array is empty.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { max } from 'ember-decorators/object/computed';
 *
 * export default class MaxValueComponent extends Component {
 *   values = A([1, 2, 5, 10]);
 *
 *   @max('values') maxValue; // 10
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to find the max value of
 */
export function max(dependentKey: string): ComputedDecorator<number>;
/**
 * Decorator that wraps [Ember.computed.min](http://emberjs.com/api/classes/Ember.computed.html#method_min)
 *
 * A computed property that calculates the minimum value in the dependent
 * array. This will return `Infinity` when the dependent array is empty.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { min } from 'ember-decorators/object/computed';
 *
 * export default class MinValueComponent extends Component {
 *   values = A([1, 2, 5, 10]);
 *
 *   @min('values') minValue; // 1
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the array to find the max value of
 */
export function min(dependentKey: string): ComputedDecorator<number>;
/**
 * Decorator that wraps [Ember.computed.none](http://emberjs.com/api/classes/Ember.computed.html#method_none)
 *
 * A computed property that returns true if the value of the dependent property
 * is null or undefined. This avoids errors from JSLint complaining about use
 * of `==`, which can be technically confusing.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { none } from 'ember-decorators/object/computed';
 *
 * export default class NameDisplayComponent extends Component {
 *   firstName = null;
 *
 *   @none('firstName') isNameless; // true unless firstName is defined
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 */
export function none(dependentKey: string): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.not](http://emberjs.com/api/classes/Ember.computed.html#method_not)
 *
 * A computed property that returns the inverse boolean value of the original
 * value for the dependent property.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { not } from 'ember-decorators/object/computed';
 *
 * export default class UserInfoComponent extends Component {
 *   loggedIn = false;
 *
 *   @not('loggedIn') isAnonymous; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to `not`
 */
export function not(dependentKey: string): ComputedDecorator<boolean>;
/**
 * Decorator that wraps [Ember.computed.notEmpty](http://emberjs.com/api/classes/Ember.computed.html#method_notEmpty)
 *
 * A computed property that returns `true` if the value of the dependent
 * property is NOT null, an empty string, empty array, or empty function.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { notEmpty } from 'ember-decorators/object/computed';
 *
 * export default class GroceryBagComponent extends Component {
 *   groceryBag = A(['milk', 'eggs', 'apples']);
 *
 *   @notEmpty('groceryBag') hasGroceriesToPutAway; // true
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key for the property to check
 */
export function notEmpty(dependentKey: string): ComputedDecorator<boolean>;
/**
 * Where `@alias` aliases `get` and `set`, and allows for bidirectional
 * data flow, `@oneWay` only provides an aliased `get`. Setting the
 * property removes the alias and causes it to be overridden entirely. This means
 * that the property will not update any longer once it has been set once, making
 * it a one way trap.
 *
 * Equivalent to the Ember [oneWay](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/reads) macro
 *
 * ```js
 * export default class UserProfileComponent extends Component {
  *   firstName = 'Joe';
  *
  *   @oneWay('firstName') originalName; // 'Joe'
  * }
  * ```
  *
  * @function
  * @param {string} dependentKey - Key for the property to alias
  * @return {any}
 */
 export function oneWay(dependentKey: string): ComputedDecorator<any>;
/**
 * Decorator that wraps [Ember.computed.or](http://emberjs.com/api/classes/Ember.computed.html#method_or)
 *
 * A computed property which performs a logical or on the original values for
 * the provided dependent properties.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { or } from 'ember-decorators/object/computed';
 *
 * export default class OutfitFeaturesComponent extends Component {
 *   hasJacket = true;
 *   hasUmbrella = false;
 *
 *   @or('hasJacket', 'hasUmbrella') isReadyForRain; // true
 * }
 * ```
 *
 * @function
 * @param {...String} dependentKey - Key for the properties to `or`
 */
export function or(...dependentKeys: string[]): ComputedDecorator<boolean>;
/**
 * Where `@alias` aliases `get` and `set`, and allows for bidirectional
 * data flow, `@reads` only provides an aliased `get`. Setting the
 * property removes the alias and causes it to be overridden entirely. This means
 * that the property will not update any longer once it has been set once, making
 * it a one way trap.
 *
 * Equivalent to the Ember [reads](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/reads) macro
 *
 * ```js
 * export default class UserProfileComponent extends Component {
 *   firstName = 'Joe';
 *
 *   @reads('firstName') originalName; // 'Joe'
 * }
 * ```
 *
 * @function
 * @param {string} dependentKey - Key for the property to alias
 * @return {any}
*/
export function reads(dependentKey: string): ComputedDecorator<any>;
/**
 * A computed property which creates a one way read-only alias to the original
 * value for property. Where `@alias` aliases `get` and `set`, and
 * `@reads` aliases get but can be overridden when set, `@readOnly`
 * provides a read only one way binding that will throw if a set is attempted.
 * Very often when using `@readOnly` one wants to explicitly prevent users from ever
 * setting the property. This prevents the reverse flow, and also throws an
 * exception when it occurs.
 *
 * Equivalent to the Ember [readOnly](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/readOnly) macro.
 *
 * ```js
 * export default class UserProfileComponent extends Component {
 *   first = 'Tomster';
 *
 *   @readOnly('first') firstName;
 * }
 */
export function readOnly(dependentKey: string): ComputedDecorator<any>;
/**
 * Decorator that wraps [Ember.computed.setDiff](http://emberjs.com/api/classes/Ember.computed.html#method_setDiff)
 *
 * A computed property which returns a new array with all the properties from
 * the first dependent array that are not in the second dependent array.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { setDiff } from 'ember-decorators/object/computed';
 *
 * export default class FavoriteThingsComponent extends Component {
 *   likes = A([ 'tacos', 'puppies', 'pizza' ]);
 *   foods = A(['tacos', 'pizza']);
 *
 *   @setDiff('likes', 'foods') favoriteThingsThatArentFood; // ['puppies']
 * }
 * ```
 *
 * @function
 * @param {String} setAProperty - Keys for the first set
 * @param {String} setBProperty - Keys for the first set
 */
export function setDiff(
  setAProperty: string,
  setBProperty: string
): ComputedDecorator<any[]>;
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
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { sort } from 'ember-decorators/object/computed';
 *
 * export default class SortNamesComponent extends Component {
 *   names = A([{name:'Link'},{name:'Zelda'},{name:'Ganon'},{name:'Navi'}]);
 *
 *   // sortDefinition syntax:
 *
 *   sorts = Object.freeze(['name:asc']);
 *   @sort('names', 'sorts')
 *   sortedNames; // [{name:'Ganon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]
 *
 *   // sort function syntax:
 *
 *   @sort('names')
 *   sortedNames(a, b){
 *     if (a.name > b.name) {
 *       return 1;
 *     } else if (a.name < b.name) {
 *       return -1;
 *     }
 *
 *     return 0;
 *   } // [{name:'Ganon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]
 *
 *   // alternative syntax:
 *
 *   @sort('names', function(a, b){
 *     if (a.name > b.name) {
 *       return 1;
 *     } else if (a.name < b.name) {
 *       return -1;
 *     }
 *
 *     return 0;
 *   }) sortedNames; // [{name:'Ganon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - The key for the array that should be sorted
 * @param {String|Function(Any, Any): Number} sortDefinition - Sorting function or sort descriptor
 */
export function sort<T>(
  dependentKey: string,
  sortDefinition: string | ((a: T, b: T) => number)
): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.sum](http://emberjs.com/api/classes/Ember.computed.html#method_sum)
 *
 * A computed property that returns the sum of the value in the dependent
 * array.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { sum } from 'ember-decorators/object/computed';
 *
 * export default class SumValuesComponent extends Component {
 *   values = A([1, 2, 3]);
 *
 *   @sum('values') total; // 6
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the array to sum up
 */
export function sum(dependentKey: string): ComputedDecorator<number>;
/**
 * Decorator that wraps [Ember.computed.union](http://emberjs.com/api/classes/Ember.computed.html#method_union)
 *
 * Alias for [union](http://emberjs.com/api/classes/Ember.computed.html#method_uniq).
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { union } from 'ember-decorators/object/computed';
 *
 * export default class LikesAndFoodsComponent extends Component {
 *   likes = A([ 'tacos', 'puppies', 'pizza' ]);
 *   foods = A(['tacos', 'pizza', 'ramen']);
 *
 *   @union('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
 * }
 * ```
 *
 * @function
 * @param {...String} dependentKeys - Keys of the arrays to union
 */
export function union(...dependentKeys: string[]): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.uniq](http://emberjs.com/api/classes/Ember.computed.html#method_uniq)
 *
 * A computed property which returns a new array with all the unique elements from one or more dependent arrays.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { uniq } from 'ember-decorators/object/computed';
 *
 * export default class FavoriteThingsComponent extends Component {
 *   likes = A([ 'tacos', 'puppies', 'pizza' ]);
 *   foods = A(['tacos', 'pizza', 'ramen']);
 *
 *   @uniq('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the array to uniq
 */
export function uniq(dependentKey: string): ComputedDecorator<any[]>;
/**
 * Decorator that wraps [Ember.computed.uniqBy](http://emberjs.com/api/classes/Ember.computed.html#method_uniqBy)
 *
 * A computed property which returns a new array with all the unique elements
 * from an array, with uniqueness determined by a specific key.
 *
 * ```javascript
 * import Component from '@ember/component';
 * import { A } from '@ember/array';
 * import { uniqBy } from 'ember-decorators/object/computed';
 *
 * export default class FruitBowlComponent extends Component {
 *   fruits = A([
 *     { name: 'banana', color: 'yellow' },
 *     { name: 'apple',  color: 'red' },
 *     { name: 'kiwi',   color: 'brown' },
 *     { name: 'cherry', color: 'red' },
 *     { name: 'lemon',  color: 'yellow' }
 *   ]);
 *
 *   @uniqBy('fruits', 'color') oneOfEachColor;
 *   // [
 *   //  { name: 'banana', color: 'yellow'},
 *   //  { name: 'apple',  color: 'red'},
 *   //  { name: 'kiwi',   color: 'brown'}
 *   // ]
 * }
 * ```
 *
 * @function
 * @param {String} dependentKey - Key of the array to uniq
 * @param {String} propertyKey - Key of the property on the objects of the array to determine uniqueness by
 */
export function uniqBy(
  dependentKey: string,
  propertyKey: string
): ComputedDecorator<any[]>;

// Prevent automatic exports of internal types
export {}
