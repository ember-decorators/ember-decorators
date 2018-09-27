import { get, set, computed } from '@ember/object';
import { A as emberA } from '@ember/array';
import { gte } from 'ember-compatibility-helpers';

import {
  macro,
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
  gte as macroGte,
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
  or,
  overridableReads,
  reads,
  setDiff,
  sort,
  sum,
  union,
  uniq,
  uniqBy
} from '@ember-decorators/object/computed';
import { readOnly as readOnlyModifier } from '@ember-decorators/object';
import { module, test } from 'qunit';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

module('javascript | macros', function() {

  test('@macro', function (assert) {
    // computed macro that returns the provided arguments as an array
    const passthroughMacro = (...args) => computed(() => args);

    class Foo {
      @macro(passthroughMacro) noArgs;
      @macro(passthroughMacro)('a', 'b') argsOnDecorator;
      @macro(passthroughMacro, 'a', 'b') argsOnMacro;
      @macro(passthroughMacro, 'a', 'b')('c', 'd') argsOnBoth;
    }

    const obj = new Foo();

    assert.deepEqual(
      get(obj, 'noArgs'),
      [],
      'invocation without arguments: @myMacro prop;'
    );
    assert.deepEqual(
      get(obj, 'argsOnDecorator'),
      ['a', 'b'],
      'invocation with arguments passed to decorator: @myMacro(a, b) prop;'
    );
    assert.deepEqual(
      get(obj, 'argsOnMacro'),
      ['a', 'b'],
      'invocation with arguments on macro (partial application): const myMacro = macro(macroFn, a, b);'
    );
    assert.deepEqual(
      get(obj, 'argsOnBoth'),
      ['a', 'b', 'c', 'd'],
      'invocation with arguments on both'
    );
  });

  test('@alias', function(assert) {
    class Foo {
      constructor() {
        this.friend = 'Guy';
      }

      @alias('friend') buddy;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'buddy'), 'Guy');

    set(obj, 'buddy', 'Pal')
    assert.equal(get(obj, 'friend'), 'Pal');
  });

  test('@and', function(assert) {
    class Foo {
      constructor() {
        this.taco = true;
        this.burrito = false;
        this.fried = true;
      }

      @and('taco', 'fried') isChalupa;
      @and('burrito', 'fried') isChimichanga;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'isChalupa'), true);
    assert.equal(get(obj, 'isChimichanga'), false);
  });

  test('@bool', function(assert) {
    class Foo {
      constructor() {
        this.one = 1;
        this.zero = 0;
        this.string = 'string';
        this.undefined = undefined;
        this.null = null;
      }
      @bool('one') isOneAwesome;
      @bool('zero') isZeroSad;
      @bool('string') isStringCool;
      @bool('undefined') isUndefinedAlright;
      @bool('null') isNullRad;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'isOneAwesome'),true);
    assert.equal(get(obj, 'isZeroSad'),false);
    assert.equal(get(obj, 'isStringCool'),true);
    assert.equal(get(obj, 'isUndefinedAlright'),false);
    assert.equal(get(obj, 'isNullRad'),false);
  });

  test('@collect', function(assert) {
    class Foo {
      constructor() {
        this.topping = 'cheese';
        this.meat = 'beef';
        this.shell = 'tortilla';
      }
      @collect('topping', 'meat', 'shell') taco;
      @collect('topping', 'shell') quesadilla;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'taco').toArray(),['cheese', 'beef', 'tortilla']);
    assert.deepEqual(get(obj, 'quesadilla').toArray(),['cheese', 'tortilla']);
  });

  test('@deprecatingAlias', function(assert) {
    class Foo {
      constructor() {
        this.friend = 'Guy';
      }
      @deprecatingAlias('friend', {
        id: 'user-profile.firstName',
        until: '3.0.0',
        url: 'https://example.com/deprecations/user-profile.firstName'
      }) buddy;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'buddy'), 'Guy');
    set(obj, 'buddy', 'Tomster');
    assert.equal(get(obj, 'friend'), 'Tomster');
  });

  test('@empty', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','two','three']);
      }
      @empty('names') hasNames;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'hasNames'), false);
    set(obj, 'names', []);
    assert.equal(get(obj, 'hasNames'), true);
    set(obj, 'names', null);
    assert.equal(get(obj, 'hasNames'), true);
    set(obj, 'names', undefined);
    assert.equal(get(obj, 'hasNames'), true);
  });

  test('@equal', function(assert) {
    class Foo {
      constructor() {
        this.name = 'Tom';
      }
      @equal('name','Tomster') isMascot;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'isMascot'), false);
    set(obj, 'name', 'Tomster');
    assert.equal(get(obj, 'isMascot'), true);
  });

  test('@filter', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([
          {name:'b', valid: true},
          {name:'z', valid: true},
          {name:'a', valid: true},
          {name:'foo', valid: false}
        ]);
      }
      @filter('names', function(item) {
        return item.valid;
      }) validNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'validNames').mapBy('name'), ['b','z','a']);
  });

  test('@filter (no callback, use descriptor value)', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([
          {name:'b', valid: true},
          {name:'z', valid: true},
          {name:'a', valid: true},
          {name:'foo', valid: false}
        ]);
      }
      @filter('names')
      validNames(item) {
        return item.valid;
      }
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'validNames').mapBy('name'), ['b','z','a']);
  });

  test('@filterBy', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([
          {name:'b', valid: true},
          {name:'z', valid: true},
          {name:'a', valid: true},
          {name:'foo', valid: false}
        ]);
      }
      @filterBy('names', 'valid') validNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'validNames').mapBy('name'), ['b','z','a']);
  });

  test('@gt', function(assert) {
    class Foo {
      constructor() {
        this.total = 9;
      }
      @gt('total', 10) isGtTen;
    }

    let obj = new Foo();
    assert.equal(get(obj, 'isGtTen'), false);
    set(obj, 'total', 10);
    assert.equal(get(obj, 'isGtTen'), false);
    set(obj, 'total', 11);
    assert.equal(get(obj, 'isGtTen'), true);
  });

  test('@gte', function(assert) {
    class Foo {
      constructor() {
        this.total = 9;
      }
      @macroGte('total', 10) isGteTen;
    }

    let obj = new Foo();
    assert.equal(get(obj, 'isGteTen'), false);
    set(obj, 'total', 10);
    assert.equal(get(obj, 'isGteTen'), true);
    set(obj, 'total', 11);
    assert.equal(get(obj, 'isGteTen'), true);
  });

  test('@intersect', function(assert) {
    class Foo {
      constructor() {
        this.cool = emberA(['tacos', 'unicorns', 'pirates']);
        this.rad = emberA(['tacos', 'zombies', 'ninjas']);
      }
      @intersect('cool','rad') coolRad;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'coolRad').toArray(), ['tacos']);
  });

  test('@lt', function(assert) {
    class Foo {
      constructor() {
        this.total = 11;
      }
      @lt('total', 10) isLtTen;
    }

    let obj = new Foo();
    assert.equal(get(obj, 'isLtTen'), false);
    set(obj, 'total', 10);
    assert.equal(get(obj, 'isLtTen'), false);
    set(obj, 'total', 9);
    assert.equal(get(obj, 'isLtTen'), true);
  });

  test('@lte', function(assert) {
    class Foo {
      constructor() {
        this.total = 11;
      }
      @lte('total', 10) isLteTen;
    }

    let obj = new Foo();
    assert.equal(get(obj, 'isLteTen'), false);
    set(obj, 'total', 10);
    assert.equal(get(obj, 'isLteTen'), true);
    set(obj, 'total', 9);
    assert.equal(get(obj, 'isLteTen'), true);
  });

  test('@map', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','two','three']);
      }
      @map('names',  function(name) {
        return name.toUpperCase() + '!';
      }) loudNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'loudNames').toArray(),['ONE!','TWO!','THREE!']);
  });

  test('@map (no callback, use descriptor value)', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','two','three']);
      }
      @map('names')
      loudNames(name) {
        return name.toUpperCase() + '!';
      }
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'loudNames').toArray(),['ONE!','TWO!','THREE!']);
  });

  test('@mapBy', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([
            {name:'b', valid: true},
            {name:'z', valid: true},
            {name:'a', valid: true}
          ]);
      }
      @mapBy('names', 'name') nameValues;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'nameValues').toArray(), ['b','z','a']);
  });

  test('@match', function(assert) {
    class Foo {
      constructor() {
      }
      @match('email', /^.+@.+\..+$/) hasValidEmail;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'hasValidEmail'), false);
    set(obj, 'email', '');
    assert.equal(get(obj, 'hasValidEmail'), false);
    set(obj, 'email', 'ember_hamster@example.com');
    assert.equal(get(obj, 'hasValidEmail'), true);
  });

  test('@max', function(assert) {
    class Foo {
      constructor() {
        this.values = emberA([1,2,3,4,5]);
      }
      @max('values') maxValue;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'maxValue'),5);
    get(obj, 'values').pushObject(10);
    assert.equal(get(obj, 'maxValue'),10);
  });

  test('@min', function(assert) {
    class Foo {
      constructor() {
        this.values = emberA([5,6,7,8,9,10]);
      }
      @min('values') minValue;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'minValue'),5);
    get(obj, 'values').pushObject(1);
    assert.equal(get(obj, 'minValue'),1);
  });

  test('@none', function(assert) {
    class Foo {
      constructor() {
        this.thing = 'foo';
      }
      @none('thing') isThing;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'isThing'), false);
    set(obj, 'thing', null);
    assert.equal(get(obj, 'isThing'), true);
  });

  test('@not', function(assert) {
    class Foo {
      constructor() {
        this.aThing = 'chickenWing';
      }
      @not('aThing') notAThing;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'notAThing'), false);
    set(obj, 'aThing', null);
    assert.equal(get(obj, 'notAThing'), true);
  });

  test('@notEmpty', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','one','two','three']);
      }
      @notEmpty('names') isNamesEmpty;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'isNamesEmpty'), true);
    set(obj, 'names', []);
    assert.equal(get(obj, 'isNamesEmpty'), false);
  });

  test('@or', function(assert) {
    class Foo {
      constructor() {
        this.cool = true;
        this.rad = 'rad';
      }
      @or('cool', 'rad') orValue;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'orValue'),true);
    set(obj, 'cool', undefined);
    assert.equal(get(obj, 'orValue'), 'rad');
  });

  test('@overridableReads', function(assert) {
    class Foo {
      constructor() {
        this.names = 'Tom';
        this.nick = 'Tomster';
      }
      @overridableReads('nick') nickName;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'nickName'), 'Tomster');
    set(obj, 'nickName', 'Honeybadger');
    assert.equal(get(obj, 'nickName'), 'Honeybadger');
    assert.equal(get(obj, 'nick'), 'Tomster');
  });

  test('@reads', function(assert) {
    class Foo {
      constructor() {
        this.names = 'Tom';
        this.nick = 'Tomster';
      }
      @reads('nick') nickName;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'nickName'), 'Tomster');

    assert.throws(
      () => {
        set(obj, 'nickName', 'Honeybadger');
      },
      /Cannot set read-only property ['"]nickName['"] on object/
    );
  });

  test('@setDiff', function(assert) {
    class Foo {
      constructor() {
        this.numbers = emberA(['one','two','three']);
        this.oddNumbers = emberA(['one','three']);
      }

      get(key) {
        // setDiff uses this.get internally
        return get(this, key);
      }

      @setDiff('numbers', 'oddNumbers') evenNumbers;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'evenNumbers'), ['two']);
  });

  test('@sort', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
      }
      @sort('names',function(a, b){
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }

        return 0;
      })
      sortedNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'sortedNames').mapBy('name'), ['a','b','foo','z']);
  });

  test('@sort (no callback, use descriptor value)', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
      }
      @sort('names')
      sortedNames(a, b){
        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        }

        return 0;
      }
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'sortedNames').mapBy('name'), ['a','b','foo','z']);
  });

  if (gte('2.0.0')) {
    test('@sort (no callback, use property value)', function(assert) {
      class Foo {
        constructor() {

          this.names = emberA([{name:'b'},{name:'z'},{name:'a'},{name:'foo'}]);
        }

        sorts = ['name:asc'];

        @sort('names', 'sorts') sortedNames;
      }

      let obj = new Foo();

      var actual = get(obj, 'sortedNames').mapBy('name');
      assert.deepEqual(actual, ['a','b','foo','z']);
    });
  }


  test('@sum', function(assert) {
    class Foo {
      constructor() {
        this.things = emberA([1,2,3]);
      }
      @sum('things') countTotal;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'countTotal'), 6);
    get(obj, 'things').pushObject(20);
    assert.equal(get(obj, 'countTotal'), 26);
  });

  test('@union', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','one','two','three']);
        this.numbers = emberA(['twenty', 'two']);
      }
      @union('names', 'numbers') unionNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'unionNames').toArray(),['one','two','three','twenty']);
  });

  test('@uniq', function(assert) {
    class Foo {
      constructor() {
        this.names = emberA(['one','one','two','three']);
      }
      @uniq('names') uniqNames;
    }

    let obj = new Foo();

    assert.deepEqual(get(obj, 'uniqNames').toArray(),['one','two','three']);
  });

  if (hasEmberVersion(2, 7)) {
    test('@uniqBy', function(assert) {
      class Foo {
        constructor() {

          this.fruits = emberA([
            { name: 'banana', color: 'yellow' },
            { name: 'apple',  color: 'red' },
            { name: 'kiwi',   color: 'brown' },
            { name: 'cherry', color: 'red' },
            { name: 'lemon',  color: 'yellow' }
          ]);
        }
        @uniqBy('fruits', 'color') oneOfEachColor;
      }

      let obj = new Foo();

      assert.deepEqual(
        get(obj, 'oneOfEachColor').toArray(),
        [
          { name: 'banana', color: 'yellow'},
          { name: 'apple',  color: 'red'},
          { name: 'kiwi',   color: 'brown'}
        ]
      );
    }, 'is available in Ember 2.7+ and works correctly');
  } else {
    test('@uniqBy', function(assert) {
      assert.throws(() => {
        class Foo {
          @uniqBy('fruits', 'color') oneOfEachColor;
        }

        new Foo();
      }, /Ember\.js v2\.7/, 'is not available in Ember <2.7 and throws an assertion');
    });
  }

  test('macros cannot be used without parameters', function(assert) {
    assert.throws(
      () => {
        class Foo {
          @alias uniqNames;
        }

        new Foo();
      },
      /Cannot decorate member 'uniqNames' without parameters/,
      'error thrown correctly'
    );
  });

  test('@readOnly modifier', function(assert) {
    class Foo {
      constructor() {
        this.userName = 'Brohuda';
      }
      @readOnlyModifier
      @alias('userName') finalName;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'finalName'), 'Brohuda');
    assert.throws(
      () => {
        set(obj, 'finalName', 'Brotom');
      },
      /Cannot set read-only property ['"]finalName['"] on object/,
      'error message thrown when trying to set readOnly property'
    );

    assert.equal(get(obj, 'finalName'), 'Brohuda');
  });

  test('@readOnly modifier can be applied in an order', function(assert) {
    class Foo {
      constructor() {
        this.userName = 'Brohuda';
      }

      @alias('userName')
      @readOnlyModifier
      finalName;
    }

    let obj = new Foo();

    assert.equal(get(obj, 'finalName'), 'Brohuda');
    assert.throws(
      () => {
        set(obj, 'finalName', 'Brotom');
      },
      /Cannot set read-only property ['"]finalName['"] on object/,
      'error message thrown when trying to set readOnly property'
    );

    assert.equal(get(obj, 'finalName'), 'Brohuda');
  });
});
