import { module, test } from 'qunit';

module('Babel | decorators (legacy)');

// This test more or less only checks, if the `@decorator` syntax can be used.

test('it works', function(assert) {
  function decorator(value) {
    assert.strictEqual(value, 123);
    return function() {};
  }

  @decorator(123)
  class Foo {}

  new Foo();
});
