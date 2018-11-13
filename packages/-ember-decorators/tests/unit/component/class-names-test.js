import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

moduleForComponent('@classNames', { integration: true });

test('decorator adds class to component', function(assert) {
  @classNames('foo')
  class FooComponent extends Component {}

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('.foo'));
});


test('decorator does not add class to superclass', function(assert) {
  @classNames('foo')
  class FooComponent extends Component {}

  @classNames('bar')
  class BarComponent extends FooComponent {}

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});

test('decorator works correctly through traditional and ES6 hierarchy', function(assert) {
  const FooComponent = Component.extend({
    classNames: ['foo']
  });

  @classNames('bar')
  class BarComponent extends FooComponent {}

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});

test('decorator throws an error if given non-string values', function(assert) {
  assert.throws(
    () => {
      @classNames(1, true, {})
      class FooComponent extends Component {}

      new FooComponent();
    },
    /The @classNames decorator must be provided strings, received:/,
    'error thrown correctly'
  )
});
