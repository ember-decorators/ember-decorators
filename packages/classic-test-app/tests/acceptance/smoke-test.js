import { module, test } from 'qunit';
import { visit, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | smoke test', function (hooks) {
  setupApplicationTest(hooks);

  test('decorator does not add attribute to superclass', async function (assert) {
    await visit('/');

    assert.strictEqual(
      findAll('[role="button"]').length,
      2,
      'Both FooComponent and BarComponent have role="button"',
    );
    assert.strictEqual(
      findAll('#bar').length,
      1,
      'Only BarComponent has id="bar"',
    );
  });
});
