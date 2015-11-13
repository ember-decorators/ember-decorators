
import Ember from "ember";
import { on, observes } from "ember-computed-decorators";
import { module, test } from "qunit";

module('on/observes decorator');

test('on', function(assert) {
  var didInit = false;

  Ember.Object.extend({
    first: 'rob',
    last: 'jackson',

    @on('init')
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

    @observes('first')
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

    @on('init')
    @observes('first')
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

    @observes('first')
    @on('init')
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
