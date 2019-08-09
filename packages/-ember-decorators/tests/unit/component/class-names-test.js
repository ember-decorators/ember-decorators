import { DEBUG } from '@glimmer/env';

import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

module('@classNames', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds class to component', async function(assert) {
    @classNames('foo')
    class FooComponent extends Component {}

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    await render(hbs`{{foo-component}}`);

    assert.ok(find('.foo'));
  });


  test('decorator does not add class to superclass', async function(assert) {
    @classNames('foo')
    class FooComponent extends Component {}

    @classNames('bar')
    class BarComponent extends FooComponent {}

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`)

    assert.equal(findAll('.foo').length, 2);
    assert.equal(findAll('.bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      classNames: ['foo']
    });

    @classNames('bar')
    class BarComponent extends FooComponent {}

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`)

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
