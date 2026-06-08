import { DEBUG } from '@glimmer/env';

import Component, { setComponentTemplate } from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { precompileTemplate } from '@ember/template-compilation';

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from '@ember/test-helpers';

module('@classNames', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds class to component', async function(assert) {
    @classNames('foo')
    class FooComponent extends Component {
      <template>Hello, world!</template>
    }

    await render(<template><FooComponent /></template>);

    assert.ok(find('.foo'));
  });

  test('decorator does not add class to superclass', async function(assert) {
    @classNames('foo')
    class FooComponent extends Component {
      <template>Hello, world!</template>
    }

    @classNames('bar')
    class BarComponent extends FooComponent {
      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      classNames: ['foo']
    });
    setComponentTemplate(precompileTemplate(`Hello, world!`, { strictMode: true }), FooComponent);

    @classNames('bar')
    class BarComponent extends FooComponent {
      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });

  if (DEBUG) {
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
  }
});
