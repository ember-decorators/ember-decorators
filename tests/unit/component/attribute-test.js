import Ember from 'ember';
import { attribute } from 'ember-decorators/component';
import { computed } from 'ember-decorators/object';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

moduleForComponent('attributes', { integration: true });

test('decorator adds attributes to component', function(assert) {
  class FooComponent extends Ember.Component {
    @attribute role = 'button';

    @attribute
    @computed
    get id() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('[role="button"]'));
  assert.ok(find('#bar'));
});

test('decorator does not add attribute to superclass', function(assert) {
  class FooComponent extends Ember.Component {
    @attribute role = 'button';
  }

  class BarComponent extends FooComponent {
    @attribute id = 'bar';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('[role="button"]').length, 2);
  assert.equal(findAll('#bar').length, 1);
});

test('decorator works correctly through traditional and ES6 hierarchy', function(assert) {
  const FooComponent = Ember.Component.extend({
    attributeBindings: ['role'],
    role: 'button'
  });

  class BarComponent extends FooComponent {
    @attribute id = 'bar';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('[role="button"]').length, 2);
  assert.equal(findAll('#bar').length, 1);
});

test('decorator allows attributes to be overriden', function(assert) {
  class FooComponent extends Ember.Component {
    @attribute role = 'button';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component role="list"}}`)

  assert.ok(find('[role="list"]'));
});

test('decorator allows attributes to be overriden by subclasses', function(assert) {
  class FooComponent extends Ember.Component {
    @attribute role = 'button';
  }

  class BarComponent extends FooComponent {
    @attribute role = 'list';
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('[role="button"]').length, 1);
  assert.equal(findAll('[role="list"]').length, 1);
});
