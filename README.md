# ember-computed-decorators

This addon allows usage of the proposed decorator syntax, and passes the specified
dependent keys into your computed function making your computed properties much DRY'er.

More details:

* [javascript-decorators proposal](https://github.com/wycats/javascript-decorators)
* [babel blog post](http://babeljs.io/blog/2015/03/31/5.0.0/#stage-1:-decorators)

## Usage

### Babel Setup

To use ember-computed-decorators you must update Babel's configuration to
allow usage of the decorator proposal.

As of Babel 5.1.0 the following should be all you need in your ember-cli application:

* pre-1.13.0
```javascript
// Brocfile.js
var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});
```

* 1.13.x
```javascript
// ember-cli-build.js
var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});
```

#### Setup with addon

Add the following `init` method to `index.js` of your addon.
This should enable the decorators to work on the parent app/addon.

```javascript
  init: function(app) {
    this.options = this.options || {};
    this.options.babel = this.options.babel || {};
    this.options.babel.optional = this.options.babel.optional || [];

    if (this.options.babel.optional.indexOf('es7.decorators') === -1) {
      this.options.babel.optional.push('es7.decorators');
    }
  }
```

### Application Usage

#### With Dependent Keys

In your application where you would normally have:

```javascript
foo: Ember.computed('someKey', 'otherKey', function() {
  var someKey = this.get('someKey');
  var otherKey = this.get('otherKey');

  // Do Stuff
})
```

You replace with this:

```javascript
import computed from 'ember-computed-decorators';

// ..... <snip> .....
@computed('someKey', 'otherKey')
foo(someKey, otherKey) {
  // Do Stuff
}
```

#### Without Dependent Keys

```javascript
foo: Ember.computed(function() {
  // Do Stuff
})
```

You replace with this:

```javascript
import computed from 'ember-computed-decorators';

// ..... <snip> .....
@computed
foo() {
  // Do Stuff
}
```

#### "Real World"

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  @computed('first', 'last')
  name(first, last) {
    return `${first} ${last}`;
  }
});
```


#### "Real World get/set syntax"

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  @computed('first', 'last')
  name: {
    get(first, last) {
      return `${first} ${last}`;
    },

    set(value, first, last) {
      // ...
    }
});
```

#### "readOnly"

```javascript
import Ember from 'ember';
import computed, { readOnly } from 'ember-computed-decorators';

export default Ember.Component.extend({
  @readOnly
  @computed('first', 'last')
  name(first, last) {
    return `${first} ${last}`;
  }
});
```

### Enumerables / Arrays

When a computed property key contains `@each`, `[]` (enumerable) then the
argument that is passed to the `get` or `set` method will be the object at the
path up to the `@each` or `[]` part.

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  persons: [
    { first: 'David', last: 'Heinemeier Hansson' },
    { first: 'Aaron', last: 'Patterson' }
  ],

  @computed('persons.@each.{first,last}')
  names(persons) {
    return persons.map((person) => `${person.first} ${person.last}`);
  }
});
```

### Property Expansion

When a computed property key contains `{foo,bar}` then the arguments that are
passed to the `get` or `set` method will bet the expanded properties.

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  address: {
    street: 'Pennsylvania Avenue',
    number: 1600
  ],

  @computed('address.{street,number}')
  formattedStreet(street, number) {
    return `${number} ${street}`;
  }
});
```

### ember-data

```javascript
import DS from 'ember-data';
import {
  attr,
  hasMany
} from "ember-computed-decorators/ember-data";

export default DS.Model.extend({
  @attr firstName,
  @hasMany users
});

```

### Computed Macros
All of the computed macros are also available for use.

#### [alias](http://emberjs.com/api/classes/Ember.computed.html#method_alias)
Creates a new property that is an alias for another property on an object. Calls to get or set this property behave as though they were called on the original property.
```javascript
import Ember from 'ember';
import { alias } from 'ember-computed-decorators';
export default Ember.Component.extend({
  person: {
    first: 'Joe'
  },

  @alias('person.first') firstName
});
```

#### [and](http://emberjs.com/api/classes/Ember.computed.html#method_and)
A computed property that performs a logical and on the original values for the provided dependent properties.
```javascript
import Ember from 'ember';
import { and } from 'ember-computed-decorators';
export default Ember.Component.extend({
  person: {
    first: 'Joe'
  },

  @and('first', 'last') hasFullName // false
});
```

#### [bool](http://emberjs.com/api/classes/Ember.computed.html#method_bool)
A computed property that converts the provided dependent property into a boolean value.
```javascript
import Ember from 'ember';
import { bool } from 'ember-computed-decorators';
export default Ember.Component.extend({
  messageCount: 1,

  @bool('messageCount') hasMessages // true
});
```

#### [collect](http://emberjs.com/api/classes/Ember.computed.html#method_collect)
A computed property that returns the array of values for the provided dependent properties.
```javascript
import Ember from 'ember';
import { collect } from 'ember-computed-decorators';
export default Ember.Component.extend({
  light: 'strobe',
  lens: '35mm prime',

  @collect('light', 'lens') equipment // ['strobe', '35mm prime']
});
```

#### [empty](http://emberjs.com/api/classes/Ember.computed.html#method_empty)
A computed property that returns `true` if the value of the dependent property is null, an empty string, empty array, or empty function.
```javascript
import Ember from 'ember';
import { empty } from 'ember-computed-decorators';
export default Ember.Component.extend({
  items: Ember.A(['taco', 'burrito']),

  @empty('items') isEmpty // false
});
```

#### [equal](http://emberjs.com/api/classes/Ember.computed.html#method_equal)
```javascript
import Ember from 'ember';
import { equal } from 'ember-computed-decorators';
export default Ember.Component.extend({
  state: 'sleepy',

  @equal('state', 'sleepy') napTime // true
});
```

#### [filter](http://emberjs.com/api/classes/Ember.computed.html#method_filter)
Filters the array by the callback.

The callback method you provide should have the following signature. item is the current item in the iteration. index is the integer index of the current item in the iteration. array is the dependant array itself.
```javascript
function(item, index, array)
```
```javascript
import Ember from 'ember';
import { filter } from 'ember-computed-decorators';
export default Ember.Component.extend({
  chores: Ember.A([
    { name: 'cook', done: true },
    { name: 'clean', done: true },
    { name: 'write more unit tests', done: false }
  ]),

  @filter('chores', function(chore, index, array) {
    return !chore.done;
  }) remainingChores // [{name: 'write more unit tests', done: false}]
});
```

#### [filterBy](http://emberjs.com/api/classes/Ember.computed.html#method_filterBy)
Filters the array by the property and value.
```javascript
import Ember from 'ember';
import { filterBy } from 'ember-computed-decorators';
export default Ember.Component.extend({
  chores: Ember.A([
    { name: 'cook', done: true },
    { name: 'clean', done: true },
    { name: 'write more unit tests', done: false }
  ]),

  @filterBy('chores', 'done', false) remainingChores // [{name: 'write more unit tests', done: false}]
});
```

#### [gt](http://emberjs.com/api/classes/Ember.computed.html#method_gt)
A computed property that returns `true` if the provided dependent property is greater than the provided value.
```javascript
import Ember from 'ember';
import { gt } from 'ember-computed-decorators';
export default Ember.Component.extend({
  totalCats: 11,

  @gt('totalCats', 10) isCatParty // true
});
```

#### [gte](http://emberjs.com/api/classes/Ember.computed.html#method_gte)
A computed property that returns `true` if the provided dependent property is greater than or equal to the provided value.
```javascript
import Ember from 'ember';
import { gte } from 'ember-computed-decorators';
export default Ember.Component.extend({
  totalPlayers: 14,

  @gte('totalPlayers', 14) hasEnoughPlayers // true
});
```

#### [intersect](http://emberjs.com/api/classes/Ember.computed.html#method_intersect)
A computed property which returns a new array with all the duplicated elements from two or more dependent arrays.
```javascript
import Ember from 'ember';
import { intersect } from 'ember-computed-decorators';
export default Ember.Component.extend({
  likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
  foods: Ember.A(['tacos', 'pizza']),

  @intersect('likes', 'foods') favoriteFoods // ['tacos', 'pizza']
});
```

#### [lt](http://emberjs.com/api/classes/Ember.computed.html#method_lt)
A computed property that returns `true` if the provided dependent property is less than the provided value.
```javascript
import Ember from 'ember';
import { lt } from 'ember-computed-decorators';
export default Ember.Component.extend({
  totalDogs: 3,

  @lt('totalDogs', 10) isDogParty // true
});
```

#### [lte](http://emberjs.com/api/classes/Ember.computed.html#method_lte)
A computed property that returns `true` if the provided dependent property is less than or equal to the provided value.
```javascript
import Ember from 'ember';
import { lte } from 'ember-computed-decorators';
export default Ember.Component.extend({
  totalPlayers: 14,

  @lte('totalPlayers', 14) hasEnoughPlayers // true
});
```

#### [map](http://emberjs.com/api/classes/Ember.computed.html#method_map)
Returns an array mapped via the callback

The callback method you provide should have the following signature. item is the current item in the iteration. index is the integer index of the current item in the iteration.
```javascript
function(item, index);
```
```javascript
import Ember from 'ember';
import { map } from 'ember-computed-decorators';
export default Ember.Component.extend({
  chores: Ember.A(['clean', 'write more unit tests']),

  @map('chores', function(chore, index) {
    return chore.toUpperCase() + '!';
  }) loudChores // ['CLEAN!', 'WRITE MORE UNIT TESTS!']
});
```

#### [mapBy](http://emberjs.com/api/classes/Ember.computed.html#method_mapBy)
Returns an array mapped to the specified key.
```javascript
import Ember from 'ember';
import { mapBy } from 'ember-computed-decorators';
export default Ember.Component.extend({
  people: Ember.A([
    {name: "George", age: 5},
    {name: "Stella", age: 10},
    {name: "Violet", age: 7}
  ]),

  @mapBy('people', 'age') ages // [5, 10, 7]
});
```

#### [match](http://emberjs.com/api/classes/Ember.computed.html#method_match)
A computed property which matches the original value for the dependent property against a given RegExp, returning `true` if they values matches the RegExp and `false` if it does not.
```javascript
import Ember from 'ember';
import { match } from 'ember-computed-decorators';
export default Ember.Component.extend({
  email: 'tomster@emberjs.com',

  @match('email', /^.+@.+\..+$/) validEmail
});
```

#### [max](http://emberjs.com/api/classes/Ember.computed.html#method_max)
A computed property that calculates the maximum value in the dependent array. This will return `-Infinity` when the dependent array is empty.
```javascript
import Ember from 'ember';
import { max } from 'ember-computed-decorators';
export default Ember.Component.extend({
  values: Ember.A([1, 2, 5, 10]),

  @max('values') maxValue // 10
});
```

#### [min](http://emberjs.com/api/classes/Ember.computed.html#method_min)
A computed property that calculates the minimum value in the dependent array. This will return `Infinity` when the dependent array is empty.
```javascript
import Ember from 'ember';
import { min } from 'ember-computed-decorators';
export default Ember.Component.extend({
  values: Ember.A([1, 2, 5, 10]),

  @min('values') minValue // 1
});
```

#### [none](http://emberjs.com/api/classes/Ember.computed.html#method_none)
A computed property that returns true if the value of the dependent property is null or undefined. This avoids errors from JSLint complaining about use of `==`, which can be technically confusing.
```javascript
import Ember from 'ember';
import { none } from 'ember-computed-decorators';
export default Ember.Component.extend({
  firstName: null,

  @none('firstName') isNameless // true until firstName is defined
});
```

#### [not](http://emberjs.com/api/classes/Ember.computed.html#method_not)
A computed property that returns the inverse boolean value of the original value for the dependent property.
```javascript
import Ember from 'ember';
import { not } from 'ember-computed-decorators';
export default Ember.Component.extend({
  loggedIn: false,

  @not('loggedIn') isAnonymous // true
});
```

#### [notEmpty](http://emberjs.com/api/classes/Ember.computed.html#method_notEmpty)
A computed property that returns `true` if the value of the dependent property is NOT null, an empty string, empty array, or empty function.
```javascript
import Ember from 'ember';
import { notEmpty } from 'ember-computed-decorators';
export default Ember.Component.extend({
  groceryBag: Ember.A(['milk', 'eggs', 'apples']),

  @notEmpty('groceryBag') hasGroceriesToPutAway // true
});
```

#### [oneWay](http://emberjs.com/api/classes/Ember.computed.html#method_oneWay)
Where `computed.alias` aliases `get` and `set`, and allows for bidirectional data flow, `computed.oneWay` only provides an aliased `get`. The `set` will not mutate the upstream property, rather causes the current property to become the value set. This causes the downstream property to permanently diverge from the upstream property.
```javascript
import Ember from 'ember';
import { oneWay } from 'ember-computed-decorators';
export default Ember.Component.extend({
  firstName: 'Joe',

  @oneWay('firstName') originalName // will always be 'Joe'
});
```

#### [or](http://emberjs.com/api/classes/Ember.computed.html#method_or)
A computed property which performs a logical or on the original values for the provided dependent properties.
```javascript
import Ember from 'ember';
import { or } from 'ember-computed-decorators';
export default Ember.Component.extend({
  hasJacket: true,
  hasUmbrella: false,

  @or('hasJacket', 'hasUmbrella') isReadyForRain // true
});
```

#### [readOnly](http://emberjs.com/api/classes/Ember.computed.html#method_readOnly)
Where `computed.oneWay` provides oneWay bindings, `computed.readOnly` provides a readOnly one way binding. Very often when using `computed.oneWay` one does not also want changes to propagate back up, as they will replace the value.

This prevents the reverse flow, and also throws an exception when it occurs.
```javascript
import Ember from 'ember';
import { readOnly } from 'ember-computed-decorators';
export default Ember.Component.extend({
  @readOnly('first') firstName // throws an error if set 'firstName' is attempted
});
```

#### [reads](http://emberjs.com/api/classes/Ember.computed.html#method_reads)
This is a more semantically meaningful alias of `computed.oneWay`, whose name is somewhat ambiguous as to which direction the data flows.
```javascript
import Ember from 'ember';
import { reads } from 'ember-computed-decorators';
export default Ember.Component.extend({
  @reads('first') firstName
});
```

#### [setDiff](http://emberjs.com/api/classes/Ember.computed.html#method_setDiff)
A computed property which returns a new array with all the properties from the first dependent array that are not in the second dependent array.
```javascript
import Ember from 'ember';
import { setDiff } from 'ember-computed-decorators';
export default Ember.Component.extend({
  likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
  foods: Ember.A(['tacos', 'pizza']),

  @setDiff('likes', 'foods') favoriteThingsThatArentFood // ['puppies']
});
```

#### [sort](http://emberjs.com/api/classes/Ember.computed.html#method_sort)
A computed property which returns a new array with all the properties from the first dependent array sorted based on a property or sort function.

The callback method you provide should have the following signature:

```javascript
function(itemA, itemB);
```
  `itemA` the first item to compare.
  `itemB` the second item to compare.

This function should return negative number (e.g. `-1`) when `itemA` should come before `itemB`. It should return positive number (e.g. `1`) when `itemA` should come after `itemB`. If the `itemA` and `itemB` are equal this function should return `0`.

Therefore, if this function is comparing some numeric values, simple `itemA - itemB` or `itemA.get( 'foo' ) - itemB.get( 'foo' )` can be used instead of series of `if`.
```javascript
import Ember from 'ember';
import { sort } from 'ember-computed-decorators';
export default Ember.Component.extend({
  this.names = Ember.A([{name:'Link'},{name:'Zelda'},{name:'Gannon'},{name:'Navi'}]);
  @sort('names', function(a, b){
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    }

    return 0;
  }) sortedNames // [{name:'Gannon'},{name:'Link'},{name:'Navi'},{name:'Zelda'}]
});
```

#### [sum](http://emberjs.com/api/classes/Ember.computed.html#method_sum)
A computed property that returns the sum of the value in the dependent array.
```javascript
import Ember from 'ember';
import { sum } from 'ember-computed-decorators';
export default Ember.Component.extend({
  values: Ember.A([1, 2, 3]),

  @sum('values') total // 6
});
```

#### [union](http://emberjs.com/api/classes/Ember.computed.html#method_union)
Alias for [uniq](http://emberjs.com/api/classes/Ember.computed.html#method_uniq).
```javascript
import Ember from 'ember';
import { union } from 'ember-computed-decorators';
export default Ember.Component.extend({
  likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
  foods: Ember.A(['tacos', 'pizza', 'ramen']),

  @union('likes', 'foods') favorites // ['tacos', 'puppies', 'pizza', 'ramen']
});
```

#### [uniq](http://emberjs.com/api/classes/Ember.computed.html#method_uniq)
A computed property which returns a new array with all the unique elements from one or more dependent arrays.
```javascript
import Ember from 'ember';
import { uniq } from 'ember-computed-decorators';
export default Ember.Component.extend({
  likes: Ember.A([ 'tacos', 'puppies', 'pizza' ]),
  foods: Ember.A(['tacos', 'pizza', 'ramen']),

  @uniq('likes', 'foods') favorites // ['tacos', 'puppies', 'pizza', 'ramen']
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
