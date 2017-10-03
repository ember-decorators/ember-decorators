import Ember from 'ember';
import { tagName } from 'ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('tagName', { integration: true });

test('decorator sets tag of component', function(assert) {
  @tagName('foo')
  class FooComponent extends Ember.Component {}

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('foo'));
});

test('decorator throws an error if given a non-string value', function(assert) {
  assert.throws(
    () => {
      @tagName(true)
      class FooComponent extends Ember.Component {}

      new FooComponent();
    },
    /The @tagName decorator must be provided a string/,
    'error thrown correctly'
  )
});

test('decorator throws an error if given more than one value', function(assert) {
  assert.throws(
    () => {
      @tagName('foo', 'bar')
      class FooComponent extends Ember.Component {}

      new FooComponent();
    },
    /The @tagName decorator must be provided exactly one argument/,
    'error thrown correctly'
  )
});

test('decorator throws an error if given no values', function(assert) {
  assert.throws(
    () => {
      @tagName
      class FooComponent extends Ember.Component {}

      new FooComponent();
    },
    /The @tagName decorator must be provided a string/, // Fails the string test because the class is passed in directly
    'error thrown correctly'
  )

  assert.throws(
    () => {
      @tagName()
      class FooComponent extends Ember.Component {}

      new FooComponent();
    },
    /The @tagName decorator must be provided exactly one argument/,
    'error thrown correctly'
  )
});
