import Component, { setComponentTemplate } from '@ember/component';
import { attribute } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { precompileTemplate } from '@ember/template-compilation';

import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { find, findAll } from '@ember/test-helpers';

module('@attribute', function(hooks) {
  setupRenderingTest(hooks);

  test('decorator adds attributes to component', async function(assert) {
    class FooComponent extends Component {
      @attribute role = 'button';

      @attribute('data-foo') foo = 'lol';

      @attribute
      @computed
      get id() {
        return 'bar';
      }

      <template>Hello, world!</template>
    }

    await render(<template><FooComponent /></template>);

    assert.ok(find('[role="button"]'));
    assert.ok(find('[data-foo="lol"]'));
    assert.ok(find('#bar'));
  });

  test('decorator does not add attribute to superclass', async function(assert) {
    class FooComponent extends Component {
      @attribute role = 'button';

      <template>Hello, world!</template>
    }

    class BarComponent extends FooComponent {
      @attribute id = 'bar';

      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('[role="button"]').length, 2);
    assert.equal(findAll('#bar').length, 1);
  });

  test('decorator works correctly through traditional and ES6 hierarchy', async function(assert) {
    const FooComponent = Component.extend({
      attributeBindings: ['role'],
      role: 'button',
    });
    setComponentTemplate(precompileTemplate(`Hello, world!`, { strictMode: true }), FooComponent);

    class BarComponent extends FooComponent {
      @attribute id = 'bar';

      <template>Hello, moon!</template>
    }

    await render(<template><FooComponent /><BarComponent /></template>);

    assert.equal(findAll('[role="button"]').length, 2);
    assert.equal(findAll('#bar').length, 1);
  });
});
