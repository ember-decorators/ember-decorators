import { DEBUG } from '@glimmer/env';

import Component, { setComponentTemplate } from '@ember/component';
import { className } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from '@ember/test-helpers';

module('@className', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds class to component', async function(assert) {
    class FooComponent extends Component {
      @className foo = 'foo';

      @className
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
    class FooComponent extends Component {
      @className('is-foo') foo = true;
      @className('', 'is-not-bar') bar = false;
      @className('', 'inactive') active = true;
      @className('is-baz') baz = false;

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
        class Foo extends Object {
          @className('is-foo', 'is-bar', 'is-baz') foo = true;
        }

        Foo.create();
      }, /The @className decorator may take up to two parameters/);

      assert.throws(() => {
        class Foo extends Object {
          @className('is-foo', 123) foo = true;
        }

        Foo.create();
      }, /The @className decorator may only receive strings as parameters/);
    });
  }

  test('decorator does not add class to superclass', async function(assert) {
    class FooComponent extends Component {
      @className foo = 'foo';

      <template>Hello, world!</template>
    }

    class BarComponent extends FooComponent {
      @className
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

    class BarComponent extends FooComponent {
      @className
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
