import Component from '@ember/component';
import { attributeBindings } from '@ember-decorators/component';
import { computed } from '@ember/object';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

module('@attributeBindings', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds attributes to component', async function(assert) {
    @attributeBindings('role', 'foo:data-foo', 'id')
    class FooComponent extends Component {
      role = 'button';
      foo = 'lol';

      @computed
      get id() {
        return 'bar';
      }
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    await render(hbs`{{foo-component}}`);

    assert.ok(find('[role="button"]'));
    assert.ok(find('[data-foo="lol"]'));
    assert.ok(find('#bar'));
  });

  test('decorator does not add attribute to superclass', async function(assert) {
    @attributeBindings('role')
    class FooComponent extends Component {
      role = 'button';
    }

    @attributeBindings('id')
    class BarComponent extends FooComponent {
      id = 'bar';
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`);

    assert.equal(findAll('[role="button"]').length, 2);
    assert.equal(findAll('#bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      attributeBindings: ['role'],
      role: 'button',
    });

    @attributeBindings('id')
    class BarComponent extends FooComponent {
      id = 'bar';
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`Hello, world!`);

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`Hello, moon!`);

    await render(hbs`{{foo-component}}{{bar-component}}`);

    assert.equal(findAll('[role="button"]').length, 2);
    assert.equal(findAll('#bar').length, 1);
  });
});
