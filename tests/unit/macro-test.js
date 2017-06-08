import Ember from "ember";
/* jshint ignore:start */
import {
  alias,
  and,
  bool,
  collect,
  empty,
  equal,
  filter,
  filterBy,
  gt,
  gte,
  intersect,
  lt,
  lte,
  map,
  mapBy,
  match,
  max,
  min,
  none,
  not,
  notEmpty,
  oneWay,
  or,
  readOnly,
  reads,
  setDiff,
  sort,
  sum,
  union,
  uniq
} from "ember-computed-decorators";
/* jshint ignore:end */
import { module, test } from "qunit";

module('macro decorator');

test('alias', function(assert) {
  var didInit = false;

  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.first = 'rob';
      this.last = 'jackson';
    },

    /* jshint ignore:start */
    @alias('first') firstName,
    @empty('first') hasNoFirstName,
    @notEmpty('first') hasFirstName,
    @none('first') hasNoneFirstName,
    @not('first') notFirstName,
    @bool('first') boolFirstName,
    @match('first', /rob/) firstNameMatch,
    @equal('first', 'rob') firstNameEqual,
    // @gt()
    // @gte
    // @lt
    // @lte
    // @and
    // @or
    // @any
    // @oneWay
    /* jshint ignore:end */
    name() {
      didInit = true;
    }
  }).create();

  assert.equal(obj.get('firstName'), 'rob');
  assert.equal(obj.get('hasNoFirstName'), false);
  assert.equal(obj.get('hasFirstName'), true);
  assert.equal(obj.get('hasNoneFirstName'), false);
  assert.equal(obj.get('notFirstName'), false);
  assert.equal(obj.get('boolFirstName'), true);
  assert.equal(obj.get('firstNameMatch'), true);
  assert.equal(obj.get('firstNameEqual'), true);

});

test('alias', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.friend = 'Guy';
    },
    /* jshint ignore:start */
    @alias('friend') buddy
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('buddy'), 'Guy');
});

test('and', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.taco = true;
      this.burrito = false;
      this.fried = true;
    },
    /* jshint ignore:start */
    @and('taco', 'fried') isChalupa,
    @and('burrito', 'fried') isChimichanga
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('isChalupa'), true);
  assert.equal(obj.get('isChimichanga'), false);
});

test('bool', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.one = 1;
      this.zero = 0;
      this.string = 'string';
      this.undefined = undefined;
      this.null = null;
    },
    /* jshint ignore:start */
    @bool('one') isOneAwesome,
    @bool('zero') isZeroSad,
    @bool('string') isStringCool,
    @bool('undefined') isUndefinedAlright,
    @bool('null') isNullRad
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('isOneAwesome'),true);
  assert.equal(obj.get('isZeroSad'),false);
  assert.equal(obj.get('isStringCool'),true);
  assert.equal(obj.get('isUndefinedAlright'),false);
  assert.equal(obj.get('isNullRad'),false);
});

test('collect', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.topping = 'cheese';
      this.meat = 'beef';
      this.shell = 'tortilla';
    },
    /* jshint ignore:start */
    @collect('topping', 'meat', 'shell') taco,
    @collect('topping', 'shell') quesadilla
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('taco').toArray(),['cheese', 'beef', 'tortilla']);
  assert.deepEqual(obj.get('quesadilla').toArray(),['cheese', 'tortilla']);
});

test('empty', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','two','three']);
    },
    /* jshint ignore:start */
    @empty('names') hasNames
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('hasNames'), false);
  obj.set('names', []);
  assert.equal(obj.get('hasNames'), true);
  obj.set('names', null);
  assert.equal(obj.get('hasNames'), true);
  obj.set('names', undefined);
  assert.equal(obj.get('hasNames'), true);
});

test('equal', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.name = 'Tom';
    },
    /* jshint ignore:start */
    @equal('name','Tomster') isMascot
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('isMascot'), false);
  obj.set('name', 'Tomster');
  assert.equal(obj.get('isMascot'), true);
});

test('filter', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([
        {name:'b', valid: true},
        {name:'z', valid: true},
        {name:'a', valid: true},
        {name:'foo', valid: false}
      ]);
    },
    /* jshint ignore:start */
    @filter('names', function(item, index, array) {
      return item.valid;
    }) validNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('validNames').mapBy('name'), ['b','z','a']);
});

test('filterBy', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([
        {name:'b', valid: true},
        {name:'z', valid: true},
        {name:'a', valid: true},
        {name:'foo', valid: false}
      ]);
    },
    /* jshint ignore:start */
    @filterBy('names', 'valid') validNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('validNames').mapBy('name'), ['b','z','a']);
});

test('gt', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 9;
    },
    /* jshint ignore:start */
    @gt('total', 10) isGtTen
    /* jshint ignore:end */
  }).create();
  assert.equal(obj.get('isGtTen'), false);
  obj.set('total', 10);
  assert.equal(obj.get('isGtTen'), false);
  obj.set('total', 11);
  assert.equal(obj.get('isGtTen'), true);
});

test('gte', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 9;
    },
    /* jshint ignore:start */
    @gte('total', 10) isGteTen
    /* jshint ignore:end */
  }).create();
  assert.equal(obj.get('isGteTen'), false);
  obj.set('total', 10);
  assert.equal(obj.get('isGteTen'), true);
  obj.set('total', 11);
  assert.equal(obj.get('isGteTen'), true);
});

test('intersect', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.cool = Ember.A(['tacos', 'unicorns', 'pirates']);
      this.rad = Ember.A(['tacos', 'zombies', 'ninjas']);
    },
    /* jshint ignore:start */
    @intersect('cool','rad') coolRad
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('coolRad').toArray(), ['tacos']);
});

test('lt', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 11;
    },
    /* jshint ignore:start */
    @lt('total', 10) isLtTen
    /* jshint ignore:end */
  }).create();
  assert.equal(obj.get('isLtTen'), false);
  obj.set('total', 10);
  assert.equal(obj.get('isLtTen'), false);
  obj.set('total', 9);
  assert.equal(obj.get('isLtTen'), true);
});

test('lte', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 11;
    },
    /* jshint ignore:start */
    @lte('total', 10) isLteTen
    /* jshint ignore:end */
  }).create();
  assert.equal(obj.get('isLteTen'), false);
  obj.set('total', 10);
  assert.equal(obj.get('isLteTen'), true);
  obj.set('total', 9);
  assert.equal(obj.get('isLteTen'), true);
});

test('map', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','two','three']);
    },
    /* jshint ignore:start */
    @map('names',  function(name, index) {
      return name.toUpperCase() + '!';
    }) loudNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('loudNames').toArray(),['ONE!','TWO!','THREE!']);
});

test('mapBy', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([
          {name:'b', valid: true},
          {name:'z', valid: true},
          {name:'a', valid: true}
        ]);
    },
    /* jshint ignore:start */
    @mapBy('names', 'name') nameValues
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('nameValues').toArray(), ['b','z','a']);
});

test('match', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
    },
    /* jshint ignore:start */
    @match('email', /^.+@.+\..+$/) hasValidEmail
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('hasValidEmail'), false);
  obj.set('email', '');
  assert.equal(obj.get('hasValidEmail'), false);
  obj.set('email', 'ember_hamster@example.com');
  assert.equal(obj.get('hasValidEmail'), true);
});

test('max', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.values = Ember.A([1,2,3,4,5]);
    },
    /* jshint ignore:start */
    @max('values') maxValue
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('maxValue'),5);
  obj.get('values').pushObject(10);
  assert.equal(obj.get('maxValue'),10);
});

test('min', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.values = Ember.A([5,6,7,8,9,10]);
    },
    /* jshint ignore:start */
    @min('values') minValue
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('minValue'),5);
  obj.get('values').pushObject(1);
  assert.equal(obj.get('minValue'),1);
});

test('none', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.thing = 'foo';
    },
    /* jshint ignore:start */
    @none('thing') isThing
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('isThing'), false);
  obj.set('thing', null);
  assert.equal(obj.get('isThing'), true);
});

test('not', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.aThing = 'chickenWing';
    },
    /* jshint ignore:start */
    @not('aThing') notAThing
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('notAThing'), false);
  obj.set('aThing', null);
  assert.equal(obj.get('notAThing'), true);
});

test('notEmpty', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','one','two','three']);
    },
    /* jshint ignore:start */
    @notEmpty('names') isNamesEmpty
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('isNamesEmpty'), true);
  obj.set('names', []);
  assert.equal(obj.get('isNamesEmpty'), false);
});

test('oneWay', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = 'Tom';
      this.nick = 'Tomster';
    },
    /* jshint ignore:start */
    @oneWay('nick') nickName
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('nickName'), 'Tomster');
  obj.set('nickName', 'Honeybadger');
  assert.equal(obj.get('nickName'), 'Honeybadger');
  assert.equal(obj.get('nick'), 'Tomster');
});

test('or', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.cool = true;
      this.rad = 'rad';
    },
    /* jshint ignore:start */
    @or('cool', 'rad') orValue
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('orValue'),true);
  obj.set('cool', undefined);
  assert.equal(obj.get('orValue'), 'rad');
});

test('readOnly', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.userName = 'Brohuda';
    },
    /* jshint ignore:start */
    @readOnly
    @alias('userName') finalName
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('finalName'), 'Brohuda');
  try {
    obj.set('finalName', 'Brotom');
  }
  catch(e) {
    assert.equal(e.message.match(/Cannot set read-only property 'finalName' on object/).length, 1);
  }
  assert.equal(obj.get('finalName'), 'Brohuda');
});

test('reads', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = 'Tom';
      this.nick = 'Tomster';
    },
    /* jshint ignore:start */
    @reads('nick') nickName
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('nickName'), 'Tomster');
  obj.set('nickName', 'Honeybadger');
  assert.equal(obj.get('nickName'), 'Honeybadger');
  assert.equal(obj.get('nick'), 'Tomster');
});

test('setDiff', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.numbers = Ember.A(['one','two','three']);
      this.oddNumbers = Ember.A(['one','three']);
    },
    /* jshint ignore:start */
    @setDiff('numbers', 'oddNumbers') evenNumbers
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('evenNumbers'),['two']);
});

test('sort', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
    },
    /* jshint ignore:start */
    @sort('names',function(a, b){
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    })
    sortedNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('sortedNames').mapBy('name'), ['a','b','foo','z']);
});

test('sum', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.things = Ember.A([1,2,3]);
    },
    /* jshint ignore:start */
    @sum('things') countTotal
    /* jshint ignore:end */
  }).create();

  assert.equal(obj.get('countTotal'), 6);
  obj.get('things').pushObject(20);
  assert.equal(obj.get('countTotal'), 26);
});

test('union', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','one','two','three']);
      this.numbers = Ember.A(['twenty', 'two']);
    },
    /* jshint ignore:start */
    @union('names', 'numbers') unionNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('unionNames').toArray(),['one','two','three','twenty']);
});

test('uniq', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','one','two','three']);
    },
    /* jshint ignore:start */
    @uniq('names') uniqNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('uniqNames').toArray(),['one','two','three']);
});

test('uniqBy', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([{ name: 'one' }, { name: 'one' }, { name: 'two' }, { name: 'three' }]);
    },
    /* jshint ignore:start */
    @uniqBy('names', 'name') uniqNames
    /* jshint ignore:end */
  }).create();

  assert.deepEqual(obj.get('uniqNames').toArray(),['one','two','three']);
});
