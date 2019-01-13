import {
  alias as emberAlias,
  and as emberAnd,
  bool as emberBool,
  collect as emberCollect,
  deprecatingAlias as emberDeprecatingAlias,
  empty as emberEmpty,
  equal as emberEqual,
  filter as emberFilter,
  filterBy as emberFilterBy,
  gt as emberGt,
  gte as emberGte,
  intersect as emberIntersect,
  lt as emberLt,
  lte as emberLte,
  map as emberMap,
  mapBy as emberMapBy,
  match as emberMatch,
  max as emberMax,
  min as emberMin,
  none as emberNone,
  not as emberNot,
  notEmpty as emberNotEmpty,
  oneWay as emberOneWay,
  or as emberOr,
  reads as emberReads,
  readOnly as emberReadOnly,
  setDiff as emberSetDiff,
  sort as emberSort,
  sum as emberSum,
  union as emberUnion,
  uniq as emberUniq,
  uniqBy as emberUniqBy
} from '@ember/object/computed';

import { assert } from '@ember/debug';

import {
  computedDecoratorWithRequiredParams
} from '@ember-decorators/utils/computed';

function legacyMacro(fn) {
  return computedDecoratorWithRequiredParams(({ descriptor }, params) => {
    if (descriptor !== undefined && typeof descriptor.value === 'function') {
      return fn(...params, descriptor.value);
    }

    return fn(...params);
  }, fn.name);
}

function legacyMacroWithRequiredMethod(fn) {
  return computedDecoratorWithRequiredParams(({ descriptor }, params) => {
    let method = descriptor !== undefined && typeof descriptor.value === 'function' ? descriptor.value : params.pop();

    assert(`The @${fn.name} decorator must be used to decorate a method`, typeof method === 'function');

    return fn(...params, method);
  }, fn.name);
}

/**
  Creates a new property that is an alias for another property on an object.

  Equivalent to the Ember [alias](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/alias) macro.

  ```js
  export default class UserProfileComponent extends Component {
    person = {
      first: 'Joe'
    };

    @alias('person.first') firstName;
  }
  ```

  @function
  @param {string} dependentKey - Key for the aliased property
  @return {any}
*/
export const alias = legacyMacro(emberAlias);

/**
  A computed property that performs a logical and on the original values for the
  provided dependent properties.

  Equivalent to the Ember [and](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/and) macro.

  ```js
  export default class UserProfileComponent extends Component {
    person = {
      first: 'Joe'
    };

    @and('person.{first,last}') hasFullName; // false
  }
  ```

  @function
  @param {...string} dependentKeys - Keys for the properties to `and`
  @return {boolean}
*/
export const and = legacyMacro(emberAnd);

/**
  A computed property that converts the provided dependent property into a
  boolean value.

  Equivalent to the Ember [bool](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/bool) macro.

  ```js
  export default class MessagesNotificationComponent extends Component {
    messageCount = 1;

    @bool('messageCount') hasMessages; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to convert
  @return {boolean}
*/
export const bool = legacyMacro(emberBool);

/**
  A computed property that returns the array of values for the provided
  dependent properties.

  Equivalent to the Ember [collect](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/collect) macro.

  ```js
  export default class CameraEquipmentComponent extends Component {
    light = 'strobe';
    lens = '35mm prime';

    @collect('light', 'lens') equipment; // ['strobe', '35mm prime']
  }
  ```

  @function
  @param {...string} dependentKeys - Keys for the properties to collect
  @return {any[]}
*/
export const collect = legacyMacro(emberCollect);

/**
  Creates a new property that is an alias for another property on an object.
  Calls to get or set this property behave as though they were called on
  the original property, but will also trigger a deprecation warning.

  Equivalent to the Ember [deprecatingAlias](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/deprecatingAlias) macro.

  ```js
  export default class UserProfileComponent extends {
    person = {
      first: 'Joe'
    };

    @deprecatingAlias('person.first', {
      id: 'user-profile.firstName',
      until: '3.0.0',
      url: 'https://example.com/deprecations/user-profile.firstName'
    }) firstName;
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to alias
  @param {object} options
*/
export const deprecatingAlias = legacyMacro(emberDeprecatingAlias);

/**
  A computed property that returns `true` if the value of the dependent
  property is null, an empty string, empty array, or empty function.

  Equivalent to the Ember [empty](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/empty) macro.

  ```js
  export default class FoodItemsComponent extends Component {
    items = ['taco', 'burrito'];

    @empty('items') isEmpty; // false
  }
  ```

  @function
  @param {string} dependentKey - Key of the property to check emptiness of
  @return {boolean}
*/
export const empty = legacyMacro(emberEmpty);

/**
  A computed property that returns true if the dependent properties are equal.

  Equivalent to the Ember [equal](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/equal) macro.

  ```js
  export default class NapTimeComponent extends Component {
    state = 'sleepy';

    @equal('state', 'sleepy') napTime; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to check
  @param {any} value - Value to compare the dependent property to
  @return {boolean}
*/
export const equal = legacyMacro(emberEqual);

/**
  Filters the items in the array by the provided callback.

  Equivalent to the Ember [filter](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/filter) macro.

  ```js
  export default class ChoresListComponent extends Component {
    chores = [
      { name: 'cook', done: true },
      { name: 'clean', done: true },
      { name: 'write more unit tests', done: false }
    ];

    @filter('chores')
    remainingChores(chore, index, array) {
      return !chore.done;
    } // [{name: 'write more unit tests', done: false}]

    // alternative syntax:

    @filter('chores', function(chore, index, array) {
      return !chore.done;
    }) remainingChores; // [{name: 'write more unit tests', done: false}]
  }
  ```

  @function
  @param {string} dependentKey - Key for the array to filter
  @param { (item: any, index: number, array: any[]) => boolean} callback? - The function to filter with
  @return {any[]}
*/
export const filter = legacyMacroWithRequiredMethod(emberFilter);

/**
  Filters the array by the property and value.

  Equivalent to the Ember [filter](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/filterBy) macro.

  ```js
  export default class ChoresListComponent extends Component {
    chores = [
      { name: 'cook', done: true },
      { name: 'clean', done: true },
      { name: 'write more unit tests', done: false }
    ];

    @filterBy('chores', 'done', false) remainingChores; // [{name: 'write more unit tests', done: false}]
  }
  ```

  @function
  @param {string} dependentKey - Key for the array to filter
  @param {string} propertyKey - Property of the array items to filter by
  @param {any} value - Value to filter by
  @return {any[]}
*/
export const filterBy = legacyMacro(emberFilterBy);

/**
  A computed property that returns `true` if the provided dependent property
  is strictly greater than the provided value.

  Equivalent to the Ember [gt](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/gt) macro.

  ```js
  export default class CatPartyComponent extends Component {
    totalCats = 11;

    @gt('totalCats', 10) isCatParty; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to compare
  @param {number} value - Value to compare against
  @return {boolean}
*/
export const gt = legacyMacro(emberGt);

/**
  A computed property that returns `true` if the provided dependent property
  is greater than or equal to the provided value.

  Equivalent to the Ember [gte](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/gte) macro.

  ```js
  export default class PlayerListComponent extends Component {
    totalPlayers = 14;

    @gte('totalPlayers', 14) hasEnoughPlayers; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to compare
  @param {number} value - Value to compare against
  @return {boolean}
*/
export const gte = legacyMacro(emberGte);

/**
  A computed property which returns a new array with all the duplicated elements
  from two or more dependent arrays.

  Equivalent to the Ember [intersect](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/intersect) macro.

  ```js
  export default class FoodListComponent extends Component {
    likes = [ 'tacos', 'puppies', 'pizza' ];
    foods = ['tacos', 'pizza'];

    @intersect('likes', 'foods') favoriteFoods; // ['tacos', 'pizza']
  }
  ```

  @function
  @param {...string} dependentKeys - Keys of the arrays to intersect
  @return {any[]}
*/
export const intersect = legacyMacro(emberIntersect);

/**
  A computed property that returns `true` if the provided dependent property
  is strictly less than the provided value.

  Equivalent to the Ember [lt](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/lt) macro

  ```js
  export default class DogPartyComponent extends Component {
    totalDogs = 3;

    @lt('totalDogs', 10) isDogParty; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to compare
  @param {number} value - Value to compare against
  @return {boolean}
*/
export const lt = legacyMacro(emberLt);

/**
  A computed property that returns `true` if the provided dependent property
  is less than or equal to the provided value.

  Equivalent to the Ember [lte](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/lte) macro.

  ```js
  export default class PlayerListComponent extends Component {
    totalPlayers = 14;

    @lte('totalPlayers', 14) hasEnoughPlayers; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to compare
  @param {number} value - Value to compare against
  @return {boolean}
*/
export const lte = legacyMacro(emberLte);

/**
  Returns an array mapped via the callback.

  Equivalent to the Ember [map](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/map) macro.

  ```js
  export default class ChoresListComponent extends Component {
    chores = ['clean', 'write more unit tests']);

    @map('chores')
    loudChores(chore, index) {
      return chore.toUpperCase() + '!';
    } // ['CLEAN!', 'WRITE MORE UNIT TESTS!']

    // alternative syntax:

    @map('chores', function(chore, index) {
      return chore.toUpperCase() + '!';
    }) loudChores; // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
  }
  ```

  @function
  @param {string} dependentKey? - Key for the array to map over
  @param { (item: any, index: number, array: any[]) => any} callback? - Function to map over the array
  @return {any[]}
*/
export const map = legacyMacroWithRequiredMethod(emberMap);

/**
  Returns an array mapped to the specified key.

  Equivalent to the Ember [mapBy](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/mapBy) macro.

  ```js
  export default class PeopleListComponent extends Component {
    people = [
      {name: "George", age: 5},
      {name: "Stella", age: 10},
      {name: "Violet", age: 7}
    ];

    @mapBy('people', 'age') ages; // [5, 10, 7]
  }
  ```

  @function
  @param {string} dependentKey - Key for the array to map over
  @param {string} propertyKey - Property of the array items to map by
  @return {any[]}
*/
export const mapBy = legacyMacro(emberMapBy);

/**
  A computed property which matches the original value for the dependent
  property against a given RegExp, returning `true` if they values matches
  the RegExp and `false` if it does not.

  Equivalent to the Ember [match](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/match) macro.

  ```js
  export default class IsEmailValidComponent extends Component {
    email = 'tomster@emberjs.com';

    @match('email', /^.+@.+\..+$/) validEmail;
  }
  ```

  @function
  @param {string} dependentKey - The property to match
  @param {RegExp} pattern - The pattern to match against
  @return {boolean}
*/
export const match = legacyMacro(emberMatch);

/**
  A computed property that calculates the maximum value in the dependent array.
  This will return `-Infinity` when the dependent array is empty.

  Equivalent to the Ember [max](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/max) macro.

  ```js
  export default class MaxValueComponent extends Component {
    values = [1, 2, 5, 10];

    @max('values') maxValue; // 10
  }
  ```

  @function
  @param {string} dependentKey - Key for the array to find the max value of
  @return {number}
*/
export const max = legacyMacro(emberMax);

/**
  A computed property that calculates the minimum value in the dependent array.
  This will return `Infinity` when the dependent array is empty.

  Equivalent to the Ember [min](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/min) macro.

  ```js
  export default class MinValueComponent extends Component {
    values = [1, 2, 5, 10];

    @min('values') minValue; // 1
  }
  ```

  @function
  @param {string} dependentKey - Key for the array to find the max value of
  @return {number}
*/
export const min = legacyMacro(emberMin);

/**
  A computed property that returns true if the value of the dependent property
  is null or undefined.

  Equivalent to the Ember [none](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/none) macro.

  ```js
  export default class NameDisplayComponent extends Component {
    firstName = null;

    @none('firstName') isNameless; // true unless firstName is defined
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to check
  @return {boolean}
*/
export const none = legacyMacro(emberNone);

/**
  A computed property that returns the inverse boolean value of the original
  value for the dependent property.

  Equivalent to the Ember [not](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/not) macro.

  ```js
  export default class UserInfoComponent extends Component {
    loggedIn = false;

    @not('loggedIn') isAnonymous; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to `not`
  @return {boolean}
*/
export const not = legacyMacro(emberNot);

/**
  A computed property that returns `true` if the value of the dependent property
  is NOT null, an empty string, empty array, or empty function.

  Equivalent to the Ember [notEmpty](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/notEmpty) macro.

  ```js
  export default class GroceryBagComponent extends Component {
    groceryBag = ['milk', 'eggs', 'apples'];

    @notEmpty('groceryBag') hasGroceriesToPutAway; // true
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to check
  @return {boolean}
*/
export const notEmpty = legacyMacro(emberNotEmpty);

/**
  Where `@alias` aliases `get` and `set`, and allows for bidirectional
  data flow, `@oneWay` only provides an aliased `get`. Setting the
  property removes the alias and causes it to be overridden entirely. This means
  that the property will not update any longer once it has been set once, making
  it a one way trap.

  Equivalent to the Ember [oneWay](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/oneWay) macro.

  ```js
  export default class UserProfileComponent extends Component {
    firstName = 'Joe';

    @oneWay('firstName') originalName; // 'Joe'
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to alias
  @return {any}
*/
export const oneWay = legacyMacro(emberOneWay, false);


/**
  A computed property which performs a logical or on the original values for the
  provided dependent properties.

  Equivalent to the Ember [or](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/or) macro.

  ```js
  export default class OutfitFeaturesComponent extends Component {
    hasJacket = true;
    hasUmbrella = false;

    @or('hasJacket', 'hasUmbrella') isReadyForRain; // true
  }
  ```

  @function
  @param {...string} dependentKey - Key for the properties to `or`
  @return {boolean}
*/
export const or = legacyMacro(emberOr);

/**
  Where `@alias` aliases `get` and `set`, and allows for bidirectional
  data flow, `@reads` only provides an aliased `get`. Setting the
  property removes the alias and causes it to be overridden entirely. This means
  that the property will not update any longer once it has been set once, making
  it a one way trap.

  Equivalent to the Ember [reads](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/reads) macro.

  ```js
  export default class UserProfileComponent extends Component {
    firstName = 'Joe';

    @reads('firstName') originalName; // 'Joe'
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to alias
  @return {any}
*/
export const reads = legacyMacro(emberReads, false);

/**
  A computed property which creates a one way read-only alias to the original
  value for property. Where `@alias` aliases `get` and `set`, and
  `@reads` aliases get but can be overridden when set, `@readOnly`
  provides a read only one way binding that will throw if a set is attempted.
  Very often when using `@reads` one wants to explicitly prevent users from ever
  setting the property. This prevents the reverse flow, and also throws an
  exception when it occurs.

  Equivalent to the Ember [readOnly](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/readOnly) macro.

  ```js
  export default class UserProfileComponent extends Component {
    first = 'Tomster';

    @readOnly('first') firstName;
  }
  ```

  @function
  @param {string} dependentKey - Key for the property to read
  @return {any}
*/
export const readOnly = legacyMacro(emberReadOnly);

/**
  A computed property which returns a new array with all the properties from the
  first dependent array that are not in the second dependent array.

  Equivalent to the Ember [setDiff](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/setDiff) macro.

  ```js
  export default class FavoriteThingsComponent extends Component {
    likes = [ 'tacos', 'puppies', 'pizza' ];
    foods = ['tacos', 'pizza'];

    @setDiff('likes', 'foods') favoriteThingsThatArentFood; // ['puppies']
  }
  ```

  @function
  @param {string} setAProperty - Key for the first set
  @param {string} setBProperty - Key for the first set
  @return {any[]}
*/
export const setDiff = legacyMacro(emberSetDiff);

/**
  A computed property which returns a new array with all the properties from
  the first dependent array sorted based on a property or sort function.

  If a callback method is provided, it should have the following signature:

  ```js
  (itemA: any, itemB: any) => number;
  ```
  - `itemA` the first item to compare.
  - `itemB` the second item to compare.

  This function should return negative number (e.g. `-1`) when `itemA` should
  come before `itemB`. It should return positive number (e.g. `1`) when
  `itemA` should come after `itemB`. If the `itemA` and `itemB` are equal this
  function should return `0`.

  Therefore, if this function is comparing some numeric values, you can do
  `itemA - itemB` or `itemA.foo - itemB.foo` instead of explicit if statements.

  ```js
  export default class SortNamesComponent extends Component {
    names = [{name:'Link'},{name:'Zelda'},{name:'Ganon'},{name:'Navi'}];

    // sortDefinition syntax:

    sorts = Object.freeze(['name:asc']);
    @sort('names', 'sorts')
    sortedNames; // [{name:'Ganon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]

    // sort function syntax:

    @sort('names')
    sortedNames(a, b){
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    } // [{ name:'Ganon' }, { name:'Link' }, { name:'Navi' }, { name:'Zelda' }]

    // alternative syntax:

    @sort('names', function(a, b){
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    }) sortedNames; // [{ name:'Ganon' }, { name:'Link' }, { name:'Navi' }, { name:'Zelda' }]
  }
  ```

  Equivalent to the Ember [sort](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/sort) macro.

  @function
  @param {string} dependentKey - The key for the array that should be sorted
  @param {string | (itemA: any, itemB: any) => number} sortDefinition? - Sorting function or sort descriptor
  @return {any[]}
*/
export const sort = legacyMacro(emberSort);

/**
  A computed property that returns the sum of the values in the dependent array.

  Equivalent to the Ember [sum](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/sum) macro.

  ```js
  export default class SumValuesComponent extends Component {
    values = [1, 2, 3];

    @sum('values') total; // 6
  }
  ```

  @function
  @param {string} dependentKey - Key of the array to sum up
  @return {number}
*/
export const sum = legacyMacro(emberSum);

/**
  Alias for [uniq](#uniq).

  Equivalent to the Ember [union](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/union) macro.

  ```js
  export default class LikesAndFoodsComponent extends Component {
    likes = [ 'tacos', 'puppies', 'pizza' ];
    foods = ['tacos', 'pizza', 'ramen'];

    @union('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
  }
  ```

  @function
  @param {...string} dependentKeys - Keys of the arrays to union
  @return {any[]}
*/
export const union = legacyMacro(emberUnion);

/**
  A computed property which returns a new array with all the unique elements from one or more dependent arrays.

  Equivalent to the Ember [uniq](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/uniq) macro.

  ```js
  export default class FavoriteThingsComponent extends Component {
    likes = [ 'tacos', 'puppies', 'pizza' ];
    foods = ['tacos', 'pizza', 'ramen'];

    @uniq('likes', 'foods') favorites; // ['tacos', 'puppies', 'pizza', 'ramen']
  }
  ```

  @function
  @param {string} dependentKey - Key of the array to uniq
  @return {any[]}
*/
export const uniq = legacyMacro(emberUniq);

/**
  A computed property which returns a new array with all the unique elements
  from an array, with uniqueness determined by a specific key.

  Equivalent to the Ember [uniqBy](https://emberjs.com/api/ember/3.1/functions/@ember%2Fobject%2Fcomputed/uniqBy) macro.

  ```js
  export default class FruitBowlComponent extends Component {
    fruits = [
      { name: 'banana', color: 'yellow' },
      { name: 'apple',  color: 'red' },
      { name: 'kiwi',   color: 'brown' },
      { name: 'cherry', color: 'red' },
      { name: 'lemon',  color: 'yellow' }
    ];

    @uniqBy('fruits', 'color') oneOfEachColor;
    // [
    //  { name: 'banana', color: 'yellow'},
    //  { name: 'apple',  color: 'red'},
    //  { name: 'kiwi',   color: 'brown'}
    // ]
  }
  ```

  @function
  @param {string} dependentKey - Key of the array to uniq
  @param {string} propertyKey - Key of the property on the objects of the array to determine uniqueness by
  @return {any[]}
*/
export const uniqBy = legacyMacro(emberUniqBy);
