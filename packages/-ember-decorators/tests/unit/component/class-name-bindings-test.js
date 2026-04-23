import { DEBUG } from '@glimmer/env';

import Component, { setComponentTemplate } from '@ember/component';
import { classNameBindings } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from '@ember/test-helpers';

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

      <template>Hello, world!</template>
    }

    await render(<template><FooComponent /></template>);

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

      <template>Hello, world!</template>
    }

    await render(<template><FooComponent /></template>);

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

      <template>Hello, world!</template>
    }

    @classNameBindings('bar')
    class BarComponent extends FooComponent {
      @computed
      get bar() {
        return 'bar';
      }

      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      classNameBindings: ['foo'],
      foo: 'foo',
    });
    setComponentTemplate(precompileTemplate(`Hello, world!`, { strictMode: true }), FooComponent);

    @classNameBindings('bar')
    class BarComponent extends FooComponent {
      @computed
      get bar() {
        return 'bar';
      }

      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });
});
