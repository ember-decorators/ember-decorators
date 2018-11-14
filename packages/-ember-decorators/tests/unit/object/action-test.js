import { DEBUG } from '@glimmer/env';

import EmberObject from '@ember/object';
import Component from '@ember/component';
import { action } from '@ember-decorators/object';

import hbs from 'htmlbars-inline-precompile';
import { test } from 'qunit';
import { findAll, click } from 'ember-native-dom-helpers';

import { componentModule } from '../../helpers/modules';

componentModule('@action', function() {
  test('action decorator works with ES6 class', async function(assert) {
    class FooComponent extends Component {
      @action
      foo() {
        assert.ok(true, 'called!');
      }
    }

    this.register('component:foo-bar', FooComponent);
    this.register('template:components/foo-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

    this.render(hbs`{{foo-bar}}`);

    await click('button');
  });

  test('action decorator does not add actions to superclass', function(assert) {
    class Foo extends EmberObject {
      @action
      foo() {
        // Do nothing
      }
    }

    class Bar extends Foo {
      @action
      bar() {
        assert.ok(false, 'called')
      }
    }

    const foo = new Foo();
    const bar = new Bar();

    assert.equal(typeof foo.actions.foo, 'function', 'foo has foo action');
    assert.equal(typeof foo.actions.bar, 'undefined', 'foo does not have bar action');

    assert.equal(typeof bar.actions.foo, 'function', 'bar has foo action');
    assert.equal(typeof bar.actions.bar, 'function', 'bar has bar action');
  });

  test('actions are properly merged through traditional and ES6 prototype hierarchy', async function(assert) {
    assert.expect(3);

    let FooComponent = Component.extend({
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

  test('action decorator super works with native class methods', async function(assert) {
    class FooComponent extends Component {
      foo() {
        assert.ok(true, 'called!');
      }
    }

    class BarComponent extends FooComponent {
      @action
      foo() {
        super.foo();
      }
    }

    this.register('component:bar-bar', BarComponent);
    this.register('template:components/bar-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

    this.render(hbs`{{bar-bar}}`);

    await click('button');
  });

  test('action decorator super works with traditional class methods', async function(assert) {
    const FooComponent = Component.extend({
      foo() {
        assert.ok(true, 'called!');
      },
    });

    class BarComponent extends FooComponent {
      @action
      foo() {
        super.foo();
      }
    }

    this.register('component:bar-bar', BarComponent);
    this.register('template:components/bar-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

    this.render(hbs`{{bar-bar}}`);

    await click('button');
  });

  test('action decorator works with parent native class actions', async function(assert) {
    class FooComponent extends Component {
      @action
      foo() {
        assert.ok(true, 'called!');
      }
    }

    class BarComponent extends FooComponent {
      @action
      foo() {
        super.foo();
      }
    }


    this.register('component:bar-bar', BarComponent);
    this.register('template:components/bar-bar', hbs`<button {{action 'foo'}}>Click Me!</button>`);

    this.render(hbs`{{bar-bar}}`);

    await click('button');
  });

  if (DEBUG) {
    test('action decorator throws an error if applied to non-functions', function(assert) {
      assert.throws(
        () => {
          class TestObject extends EmberObject {
            @action foo = 'bar'
          }

          new TestObject();
        },
        /The @action decorator must be applied to functions/,
        'error thrown correctly'
      )
    });
  }
});
