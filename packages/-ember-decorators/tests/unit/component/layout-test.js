import Component from '@ember/component';
import { layout } from '@ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find } from 'ember-native-dom-helpers';

moduleForComponent('javascript | @layout', { integration: true });

test('decorator sets layout of component', function(assert) {
  @layout(hbs`<section class='foo'>Hello, world!</section>`)
  class FooComponent extends Component {}

  this.register('component:foo-component', FooComponent);

  this.render(hbs`{{foo-component}}`);
  assert.ok(find('section.foo'));
});

test('decorator throws an error if given a non-template value', function(assert) {
  assert.throws(
    () => {
      @layout([`{{foo-component}}`])
      class FooComponent extends Component {}

      new FooComponent();
    },
    /The @layout decorator must be provided a template/,
    'error thrown correctly'
  )
});
test('decorator throws a specialized error if given a string value', function(assert) {
  assert.throws(
    () => {
      @layout(`{{foo-component}}`)
      class FooComponent extends Component {}

      new FooComponent();
    },
    /use 'htmlbars-inline-precompile'/,
    'error thrown correctly'
  )
});

test('decorator throws an error if given more than one value', function(assert) {
  assert.throws(
    () => {
      @layout('foo', 'bar')
      class FooComponent extends Component {}

      new FooComponent();
    },
    /The @layout decorator must be provided exactly one argument/,
    'error thrown correctly'
  )
});

test('decorator throws an error if given no values', function(assert) {
  assert.throws(
    () => {
      @layout
      class FooComponent extends Component {}

      new FooComponent();
    },
    /The @layout decorator must be provided a template/, // Fails the string test because the class is passed in directly
    'error thrown correctly'
  )

  assert.throws(
    () => {
      @layout()
      class FooComponent extends Component {}

      new FooComponent();
    },
    /The @layout decorator must be provided exactly one argument/,
    'error thrown correctly'
  )
});
