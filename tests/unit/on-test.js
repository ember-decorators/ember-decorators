
import Ember from "ember";
import { on, observes } from "ember-computed-decorators";
import { module, test, skip } from "qunit";

const { get, set } = Ember;

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
