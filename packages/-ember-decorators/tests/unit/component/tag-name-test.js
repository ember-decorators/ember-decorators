import { DEBUG } from '@glimmer/env';

import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find } from 'ember-native-dom-helpers';

module('@tagName', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator sets tag of component', async function(assert) {
    @tagName('foo')
    class FooComponent extends Component {}

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    await render(hbs`{{foo-component}}`);

    assert.ok(find('foo'));
  });

  if (DEBUG) {
    test('decorator throws an error if given a non-string value', function(assert) {
      assert.throws(
        () => {
          @tagName(true)
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @tagName decorator must be provided a string/,
        'error thrown correctly'
      )
    });

    test('decorator throws an error if given more than one value', function(assert) {
      assert.throws(
        () => {
          @tagName('foo', 'bar')
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @tagName decorator must be provided exactly one argument/,
        'error thrown correctly'
      )
    });

    test('decorator throws an error if given no values', function(assert) {
      assert.throws(
        () => {
          @tagName
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @tagName decorator requires parameters/, // Fails the string test because the class is passed in directly
        'error thrown correctly'
      )

      assert.throws(
        () => {
          @tagName()
          class FooComponent extends Component {}

          new FooComponent();
        },
        /The @tagName decorator requires parameters/,
        'error thrown correctly'
      )
    });
  }
});
