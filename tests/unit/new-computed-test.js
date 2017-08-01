import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { module, test } from 'qunit';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

const { get, set } = Ember;

module('new computed property style (get/set functions)');

if (SUPPORTS_NEW_COMPUTED) {
  test('allows using ember-new-computed style get/set syntax', function(assert) {
    // not currently supported by Babel (waiting on confirmation from @wycats
    // before opening an issue)
    let setCallCount = 0;
    let getCallCount = 0;
    let obj = {
      first: 'rob',
      last: 'jackson',

      @computed('first', 'last')
      name: {
        get(first, last) {
          assert.equal(first, 'rob');
          assert.equal(last, 'jackson');

          getCallCount++;
        },

        set(value, first, last) {
          assert.equal(first, 'rob');
          assert.equal(last, 'jackson');

          setCallCount++;

          return `${value}-transformed`;
        }
      }
    };

    get(obj, 'name');
    assert.equal(getCallCount, 1, 'calls getter initially');

    get(obj, 'name');
    assert.equal(getCallCount, 1, 'does not call getter when cache is not busted');

    set(obj, 'name', 'foo');
    assert.equal(setCallCount, 1, 'calls setter when set');

    assert.strictEqual(get(obj, 'name'), 'foo-transformed', 'return value of setter is new value of computed property')
  });

  test('attr.foo passes attr.foo', function(assert) {
    assert.expect(2);

    let obj = {
      attr: {
        foo: 'bar'
      },

      @computed('attr.foo')
      something: {
        get(foo) {
          assert.deepEqual(foo, 'bar');
        },
        set(value, foo) {
          assert.deepEqual(foo, 'bar');
        }
      },
    };

    get(obj, 'something');
    set(obj, 'something', 'something');
  });

  test('attr.models.@each passes attr.models', function(assert) {
    assert.expect(2);

    let obj = {
      attr: {
        models: ['one', 'two']
      },

      @computed('attr.models.@each.length')
      something: {
        get(models) {
          assert.deepEqual(models, ['one', 'two']);
        },
        set(value, models) {
          assert.deepEqual(models, ['one', 'two']);
        }
      },
    };

    get(obj, 'something');
    set(obj, 'something', 'something');
  });

  test('attr.models.[] passes attr.models', function(assert) {
    assert.expect(2);

    let obj = {
      models: ['one', 'two'],

      @computed('models.[]')
      something: {
        get(models) {
          assert.deepEqual(models, ['one', 'two']);
        },
        set(value, models) {
          assert.deepEqual(models, ['one', 'two']);
        }
      },
    };

    get(obj, 'something');
    set(obj, 'something', 'something');
  });

  test('attr.{foo,bar} passes attr.foo and attr.bar', function(assert) {
    assert.expect(4);

    let obj = {
      attr: {
        foo: 'foo',
        bar: 'bar'
      },

      @computed('attr.{foo,bar}')
      something: {
        get(foo, bar) {
          assert.equal(foo, 'foo');
          assert.equal(bar, 'bar');
        },
        set(value, foo, bar) {
          assert.equal(foo, 'foo');
          assert.equal(bar, 'bar');
        }
      },
    };

    get(obj, 'something');
    set(obj, 'something', 'something');
  });

  test('attr.@each.{foo,bar} passes attr', function(assert) {
    assert.expect(2);

    let obj = {
      attr: [{
        foo: 'foo',
        bar: 'bar'
      }],

      @computed('attr.@each.{foo,bar}')
      something: {
        get(models) {
          assert.deepEqual(models, [{ foo: 'foo', bar: 'bar' }]);
        },
        set(value, models) {
          assert.deepEqual(models, [{ foo: 'foo', bar: 'bar' }]);
        }
      },
    };

    get(obj, 'something');
    set(obj, 'something', 'something');
  });
}
