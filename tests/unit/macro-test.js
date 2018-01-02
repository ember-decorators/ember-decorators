import Ember from 'ember';
import { IS_EMBER_2 } from 'ember-compatibility-helpers';

import {
  alias,
  and,
  bool,
  collect,
  deprecatingAlias,
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
  reads,
  setDiff,
  sort,
  sum,
  union,
  uniq,
  uniqBy
} from 'ember-decorators/object/computed';
import { readOnly } from 'ember-decorators/object';
import { module, test } from 'qunit';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

module('macro decorator');

test('alias', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.first = 'rob';
      this.last = 'jackson';
    },

    @alias('first') firstName: null,
    @empty('first') hasNoFirstName: null,
    @notEmpty('first') hasFirstName: null,
    @none('first') hasNoneFirstName: null,
    @not('first') notFirstName: null,
    @bool('first') boolFirstName: null,
    @match('first', /rob/) firstNameMatch: null,
    @equal('first', 'rob') firstNameEqual: null,
    // @gt()
    // @gte
    // @lt
    // @lte
    // @and
    // @or
    // @any
    // @oneWay
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
    @alias('friend') buddy: null
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
    @and('taco', 'fried') isChalupa: null,
    @and('burrito', 'fried') isChimichanga: null
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
    @bool('one') isOneAwesome: null,
    @bool('zero') isZeroSad: null,
    @bool('string') isStringCool: null,
    @bool('undefined') isUndefinedAlright: null,
    @bool('null') isNullRad: null
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
    @collect('topping', 'meat', 'shell') taco: null,
    @collect('topping', 'shell') quesadilla: null
  }).create();

  assert.deepEqual(obj.get('taco').toArray(),['cheese', 'beef', 'tortilla']);
  assert.deepEqual(obj.get('quesadilla').toArray(),['cheese', 'tortilla']);
});

test('deprecatingAlias', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.friend = 'Guy';
    },
    @deprecatingAlias('friend', {
      id: 'user-profile.firstName',
      until: '3.0.0',
      url: 'https://example.com/deprecations/user-profile.firstName'
    }) buddy: null
  }).create();

  assert.equal(obj.get('buddy'), 'Guy');
  obj.set('buddy', 'Tomster');
  assert.equal(obj.get('friend'), 'Tomster');
});

test('empty', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','two','three']);
    },
    @empty('names') hasNames: null
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
    @equal('name','Tomster') isMascot: null
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
    @filter('names', function(item) {
      return item.valid;
    }) validNames: null
  }).create();

  assert.deepEqual(obj.get('validNames').mapBy('name'), ['b','z','a']);
});

test('filter (no callback, use descriptor value)', function(assert) {
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
    @filter('names')
    validNames(item) {
      return item.valid;
    }
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
    @filterBy('names', 'valid') validNames: null
  }).create();

  assert.deepEqual(obj.get('validNames').mapBy('name'), ['b','z','a']);
});

test('gt', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 9;
    },
    @gt('total', 10) isGtTen: null
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
    @gte('total', 10) isGteTen: null
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
    @intersect('cool','rad') coolRad: null
  }).create();

  assert.deepEqual(obj.get('coolRad').toArray(), ['tacos']);
});

test('lt', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.total = 11;
    },
    @lt('total', 10) isLtTen: null
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
    @lte('total', 10) isLteTen: null
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
    @map('names',  function(name) {
      return name.toUpperCase() + '!';
    }) loudNames: null
  }).create();

  assert.deepEqual(obj.get('loudNames').toArray(),['ONE!','TWO!','THREE!']);
});

test('map (no callback, use descriptor value)', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','two','three']);
    },
    @map('names')
    loudNames(name) {
      return name.toUpperCase() + '!';
    }
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
    @mapBy('names', 'name') nameValues: null
  }).create();

  assert.deepEqual(obj.get('nameValues').toArray(), ['b','z','a']);
});

test('match', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
    },
    @match('email', /^.+@.+\..+$/) hasValidEmail: null
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
    @max('values') maxValue: null
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
    @min('values') minValue: null
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
    @none('thing') isThing: null
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
    @not('aThing') notAThing: null
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
    @notEmpty('names') isNamesEmpty: null
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
    @oneWay('nick') nickName: null
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
    @or('cool', 'rad') orValue: null
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
    @readOnly
    @alias('userName') finalName: null
  }).create();

  assert.equal(obj.get('finalName'), 'Brohuda');
  assert.throws(
    () => {
      obj.set('finalName', 'Brotom');
    },
    /Cannot set read-only property ['"]finalName['"] on object/,
    'error message thrown when trying to set readOnly property'
  );

  assert.equal(obj.get('finalName'), 'Brohuda');
});

test('reads', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = 'Tom';
      this.nick = 'Tomster';
    },
    @reads('nick') nickName: null
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
    @setDiff('numbers', 'oddNumbers') evenNumbers: null
  }).create();

  assert.deepEqual(obj.get('evenNumbers'),['two']);
});

test('sort', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
    },
    @sort('names',function(a, b){
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    })
    sortedNames: null
  }).create();

  assert.deepEqual(obj.get('sortedNames').mapBy('name'), ['a','b','foo','z']);
});

test('sort (no callback, use descriptor value)', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
    },
    @sort('names')
    sortedNames(a, b){
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    }
  }).create();

  assert.deepEqual(obj.get('sortedNames').mapBy('name'), ['a','b','foo','z']);
});

if (IS_EMBER_2) {
  test('sort (no callback, use property value)', function(assert) {
    var obj = Ember.Object.extend({
      init() {
        this._super(...arguments);
        this.names = Ember.A([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
      },

      sorts: ['name:asc'],
      @sort('names', 'sorts')
      sortedNames: null
    }).create();

    var actual = obj.get('sortedNames').mapBy('name');
    assert.deepEqual(actual, ['a','b','foo','z']);
  });

  test('sort (no callback, use property value, es6)', function(assert) {
    class TestSort extends Ember.Object {
      constructor() {
        super();

        this.names = Ember.A([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
      }

      sorts = ['name:asc'];
      @sort('names', 'sorts') sortedNames;
    }

    var actual = new TestSort().get('sortedNames').mapBy('name');
    assert.deepEqual(actual, ['a','b','foo','z']);
  });
}


test('sum', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.things = Ember.A([1,2,3]);
    },
    @sum('things') countTotal: null
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
    @union('names', 'numbers') unionNames: null
  }).create();

  assert.deepEqual(obj.get('unionNames').toArray(),['one','two','three','twenty']);
});

test('uniq', function(assert) {
  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.names = Ember.A(['one','one','two','three']);
    },
    @uniq('names') uniqNames: null
  }).create();

  assert.deepEqual(obj.get('uniqNames').toArray(),['one','two','three']);
});

if (hasEmberVersion(2, 7)) {
  test('uniqBy', function(assert) {
    var obj = Ember.Object.extend({
      init() {
        this._super(...arguments);
        this.fruits = Ember.A([
          { name: 'banana', color: 'yellow' },
          { name: 'apple',  color: 'red' },
          { name: 'kiwi',   color: 'brown' },
          { name: 'cherry', color: 'red' },
          { name: 'lemon',  color: 'yellow' }
        ]);
      },
      @uniqBy('fruits', 'color') oneOfEachColor: null
    }).create();

    assert.deepEqual(
      obj.get('oneOfEachColor').toArray(),
      [
        { name: 'banana', color: 'yellow'},
        { name: 'apple',  color: 'red'},
        { name: 'kiwi',   color: 'brown'}
      ]
    );
  }, 'is available in Ember 2.7+ and works correctly');
} else {
  test('uniqBy', function(assert) {
    assert.throws(() => {
      Ember.Object.extend({
        @uniqBy('fruits', 'color') oneOfEachColor: null
      });
    }, /Ember\.js v2\.7/, 'is not available in Ember <2.7 and throws an assertion');
  });
}

test('macros cannot be used without parameters', function(assert) {
  assert.throws(
    () => {
      Ember.Object.extend({
        @alias uniqNames: null
      }).create();
    },
    /Cannot use 'alias' on field 'uniqNames' without parameters/,
    'error thrown correctly'
  );
});
