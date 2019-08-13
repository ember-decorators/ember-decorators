import { DEBUG } from '@glimmer/env';

import Component from '@ember/component';
import { classNameBindings } from '@ember-decorators/component';
import { computed } from '@ember/object';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

module('@classNameBindings', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds class to component', async function(assert) {
    @classNameBindings('foo', 'bar')
    class FooComponent extends Component {
      foo = 'foo';

      @computed
      get bar() {
        return 'bar';
      }
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    await render(hbs`{{foo-component}}`);

    assert.ok(find('.foo'));
    assert.ok(find('.bar'));
  });

  test('decorator applies true/false class names', async function(assert) {
    @classNameBindings('foo:is-foo', 'bar::is-not-bar', 'active::inactive', 'baz:is-baz')
    class FooComponent extends Component {
      foo = true;
      bar = false;
      active = true;
      baz = false;
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    await render(hbs`{{foo-component}}`);

    assert.ok(find('.is-foo'));
    assert.ok(find('.is-not-bar'));
    assert.notOk(find('.inactive'));
    assert.notOk(find('.is-baz'));
  });

  if (DEBUG) {
    test('decorator throws on incorrect parameter usage', function(assert) {
      assert.throws(() => {
        @classNameBindings('foo', 123)
        class Foo extends Object {
          foo = true;
        }

        Foo.create();
      }, /The @classNameBindings decorator must be provided strings/);
    });
  }

  test('decorator does not add class to superclass', async function(assert) {
    @classNameBindings('foo')
    class FooComponent extends Component {
      foo = 'foo';
    }

    @classNameBindings('bar')
    class BarComponent extends FooComponent {
      @computed
      get bar() {
        return 'bar';
      }
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      classNameBindings: ['foo'],
      foo: 'foo',
    });

    @classNameBindings('bar')
    class BarComponent extends FooComponent {
      @computed
      get bar() {
        return 'bar';
      }
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });
});
