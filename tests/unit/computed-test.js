import Ember from "ember";
import computed from "ember-computed-decorators";
import { module, test, skip } from "qunit";

const { get, set } = Ember;

module('decorated computed with dependent keys', {
  beforeEach() {

  }
});

test('passes dependent keys into function as arguments', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
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

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
    name(first, last) {
      return `${first} ${last}`;
    }
  };

  assert.equal(get(obj, 'name'), 'rob jackson');
  set(obj, 'first', 'al');
  assert.equal(get(obj, 'name'), 'al jackson');
});

test('only calls getter when dependent keys change', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
    name(first, last) {
      callCount++;
    }
  };

  get(obj, 'name');
  assert.equal(callCount, 1);

  get(obj, 'name');
  assert.equal(callCount, 1);
});

test('throws an error when attempting to use ES6 getter/setter syntax', function(assert) {
  assert.throws(function() {
    let obj = {
      first: 'rob',
      last: 'jackson',

      /* jshint ignore:start */
      @computed('first', 'last')
      /* jshint ignore:end */
      set name(value) { },

      get name() { }
    };
  });
});

skip('allows using ember-new-computed style get/set syntax', function(assert) {
  // not currently supported by Babel (waiting on confirmation from @wycats
  // before opening an issue)
  let setCallCount = 0;
  let getCallCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @computed('first', 'last')
    /* jshint ignore:end */
    name: {
      get: function(first, last) {
        assert.equal(first, 'rob');
        assert.equal(last, 'jackson');

        getCallCount++;
      },

      set: function(value, first, last) {
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
