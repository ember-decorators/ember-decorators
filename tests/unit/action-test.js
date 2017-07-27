import Ember from 'ember';
import { action } from 'ember-decorators/object';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { findAll, click } from 'ember-native-dom-helpers';

import { HAS_UNDERSCORE_ACTIONS } from 'ember-compatibility-helpers';

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
  assert.throws(
    () => {
      class TestObject extends Ember.Object {
        @action foo = 'bar'
      }

      new TestObject();
    },
    /The @action decorator must be applied to functions/,
    'error thrown correctly'
  )
});

test('action decorator does not add actions to superclass', function(assert) {
  class Foo extends Ember.Object {
    @action
    foo() {
      // Do nothing
    }
  }

  // eslint-disable-next-line
  class Bar extends Foo {
    @action
    bar() {
      assert.ok(false, 'called')
    }
  }

  const foo = new Foo();
  const bar = new Bar();

  const fooActions = HAS_UNDERSCORE_ACTIONS ? foo._actions : foo.actions;
  const barActions = HAS_UNDERSCORE_ACTIONS ? bar._actions : bar.actions;

  assert.equal(typeof fooActions.foo, 'function', 'foo has foo action');
  assert.equal(typeof fooActions.bar, 'undefined', 'foo does not have bar action');

  assert.equal(typeof barActions.foo, 'function', 'bar has foo action');
  assert.equal(typeof barActions.bar, 'function', 'bar has bar action');
});

test('actions are properly merged through traditional and ES6 prototype hierarchy', async function(assert) {
  assert.expect(3);

  let FooComponent = Ember.Component.extend({
    actions: {
      foo() {
        assert.ok(true, 'foo called!');
      }
    }
  })

  class BarComponent extends FooComponent {
    @action
    bar() {
      assert.ok(true, 'bar called!');
    }
  }

  class BazComponent extends BarComponent {
    @action
    baz() {
      assert.ok(true, 'baz called!');
    }
  }

  this.register('component:baz-component', BazComponent);
  this.register('template:components/baz-component', hbs`
    <button {{action 'foo'}}>Click Foo!</button>
    <button {{action 'bar'}}>Click Bar!</button>
    <button {{action 'baz'}}>Click Baz!</button>
  `);

  this.render(hbs`{{baz-component}}`);

  let buttons = findAll('button');

  await click(buttons[0]);
  await click(buttons[1]);
  await click(buttons[2]);
});
