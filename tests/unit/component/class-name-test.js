import Ember from 'ember';
import { className } from 'ember-decorators/component';
import { computed } from 'ember-decorators/object';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

moduleForComponent('className', { integration: true });

test('decorator adds class to component', function(assert) {
  class FooComponent extends Ember.Component {
    @className foo = 'foo';

    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('.foo'));
  assert.ok(find('.bar'));
});

test('class names can be overriden', function(assert) {
  class FooComponent extends Ember.Component {
    @className foo = 'button';
    @className bar;
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component foo="baz" bar="bip"}}`);

  assert.ok(find('.baz'));
  assert.ok(find('.bip'));
});

test('decorator does not add class to superclass', function(assert) {
  class FooComponent extends Ember.Component {
    @className foo = 'foo';
  }

  class BarComponent extends FooComponent {
    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});

test('decorator works correctly through traditional and ES6 hierarchy', function(assert) {
  const FooComponent = Ember.Component.extend({
    classNameBindings: ['foo'],
    foo: 'foo'
  });

  class BarComponent extends FooComponent {
    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});

test('decorator allows attributes to be overriden', function(assert) {
  class FooComponent extends Ember.Component {
    @className foo = 'foo';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component foo="bar"}}`)

  assert.ok(find('.bar'));
});

test('decorator allows attributes to be overriden by subclasses', function(assert) {
  class FooComponent extends Ember.Component {
    @className foo = 'foo';
  }

  class BarComponent extends FooComponent {
    @className foo = 'bar';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 1);
  assert.equal(findAll('.bar').length, 1);
});
