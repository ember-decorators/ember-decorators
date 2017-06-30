import Ember from 'ember';
import action from 'ember-computed-decorators/action';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('actions', { integration: true });

test('action decorator works with standard Ember Object model', function(assert) {
  this.register('component:foo-bar', Ember.Component.extend({
    @action
    foo() {
      assert.ok(true, 'called!');
    }
  }));
  this.register('template:components/foo-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

  this.render(hbs`{{foo-bar}}`);

  return click('button');
});


test('action decorator works with ES6 class', function(assert) {
  this.register('component:foo-bar', class FooComponent extends Ember.Component {
    @action
    foo() {
      assert.ok(true, 'called!');
    }
  });
  this.register('template:components/foo-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

  this.render(hbs`{{foo-bar}}`);

  return click('button');
});

test('action decorator throws an error if applied to non-functions', function(assert) {
  try {
    class TestObject extends Ember.Object {
      @action foo = 'bar'
    }

    new TestObject();
  } catch ({ message }) {
    assert.equal(message, 'The @action decorator must be applied to functions', 'error message sent correctly');
  }
});
