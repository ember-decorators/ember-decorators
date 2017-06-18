import Ember from "ember";
import { on, observes } from "ember-computed-decorators"; // jshint ignore:line
import { module, test } from "qunit";

module('on/observes decorator');

test('on', function(assert) {
  var didInit = false;

  Ember.Object.extend({
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @on('init')
    /* jshint ignore:end */
    name() {
      didInit = true;
    }
  }).create();

  assert.ok(didInit, 'expected the init to fire');
});

test('observes', function(assert) {
  var didObserve = false;

  var obj = Ember.Object.extend({
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @observes('first')
    /* jshint ignore:end */
    name() {
      didObserve = true;
    }
  }).create();

  assert.ok(!didObserve, 'expected the observer to NOT have fired');
  Ember.run(obj, 'set', 'first', 'stef');
  assert.ok(didObserve, 'expected the observer to have fired');
});


test('on -> observes', function(assert) {
  var didInit = false;

  var obj = Ember.Object.extend({
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @on('init')
    @observes('first')
    /* jshint ignore:end */
    name() {
      didInit = true;
    }
  }).create();

  assert.ok(didInit, 'expected the init to fire');

  didInit = false;

  assert.ok(!didInit, 'expected the observer to NOT have fired');
  Ember.run(obj, 'set', 'first', 'stef');
  assert.ok(didInit, 'expected the observer to have fired');
});

test('observes > on', function(assert) {
  var didInit = false;

  var obj = Ember.Object.extend({
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @observes('first')
    @on('init')
    /* jshint ignore:end */
    name() {
      didInit = true;
    }
  }).create();

  assert.ok(didInit, 'expected the init to fire');

  didInit = false;

  assert.ok(!didInit, 'expected the observer to NOT have fired');
  Ember.run(obj, 'set', 'first', 'stef');
  assert.ok(didInit, 'expected the observer to have fired');
});

test('observes throws an error if used without parameters', function(assert) {
  try {
    Ember.Object.extend({
      /* jshint ignore:start */
      @observes
      /* jshint ignore:end */
      foo() {}
    }).create();
  } catch ({ message }) {
    assert.equal(message, 'Cannot `observe` without property names', 'error thrown correctly');
  }
});

test('on throws an error if used without parameters', function(assert) {
  try {
    Ember.Object.extend({
      /* jshint ignore:start */
      @on
      /* jshint ignore:end */
      foo() {}
    }).create();
  } catch ({ message }) {
    assert.equal(message, 'Cannot `on` without event names', 'error thrown correctly');
  }
});
