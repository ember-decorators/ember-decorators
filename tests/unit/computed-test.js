import Ember from 'ember';
import computed, { readOnly } from 'ember-computed-decorators';
import { module, test } from 'qunit';

const { get, set } = Ember;

module('decorated computed with dependent keys', {
  beforeEach() {

  }
});

test('passes dependent keys into function as arguments', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name(first, last) {
      assert.equal(first, 'rob');
      assert.equal(last, 'jackson');
    }
  };

  get(obj, 'name');
});

test('dependent key changes invalidate the computed property', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  };

  assert.equal(get(obj, 'name'), 'rob jackson');
  set(obj, 'first', 'al');
  assert.equal(get(obj, 'name'), 'al jackson');
});


test('readOnly', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @readOnly
    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  };

  assert.throws(function() {
    set(obj, 'name', 'al');
  }, /Cannot set read-only property/);
});

test('only calls getter when dependent keys change', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name() {
      callCount++;
    }
  };

  get(obj, 'name');
  assert.equal(callCount, 1);

  get(obj, 'name');
  assert.equal(callCount, 1);
});

test('throws an error when attempting to use ES6 getter/setter syntax', function(assert) {
  assert.throws(() => {
    return {
      first: 'rob',
      last: 'jackson',

      @computed('first', 'last')
      set name(value) { return value; },

      get name() { }
    };
  });
});

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
      }
    }
  };

  get(obj, 'name');
  assert.equal(getCallCount, 1, 'calls getter initially');

  get(obj, 'name');
  assert.equal(getCallCount, 1, 'does not call getter when cache is not busted');

  set(obj, 'name', 'foo');
  assert.equal(setCallCount, 1, 'calls setter when set');
});

module('decorated computed without dependent keys');

test('works properly', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @computed
    /* jshint ignore:end */
    name() {
      callCount++;
    }
  };

  get(obj, 'name');

  assert.equal(callCount, 1);
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

test('works with es6 class', function(assert) {
  assert.expect(2);

  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
    fullName(first, last) {
      assert.equal(first, 'rob');
      assert.equal(last, 'jackson');
    }
  }

  let obj = new Foo();
  get(obj, 'fullName');
});

test('works with es6 class getter', function(assert) {
  assert.expect(2);

  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
    get fullName() {
      assert.equal(this.first, 'rob');
      assert.equal(this.last, 'jackson');
    }
  }

  let obj = new Foo();
  get(obj, 'fullName');
});
