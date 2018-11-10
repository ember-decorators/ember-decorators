import { module, test } from 'qunit';

module('Babel | decorators (legacy) and class properties together ');

// This test more or less only checks, if the `@decorator` syntax can be used.

test('decorators inside class and class field work.', function(assert) {
  function decorator(value) {
    assert.strictEqual(value, 123);
    return function() {};
  }

  class Foo {
    @decorator(123)
    bar = 'baz'

  }

  new Foo();
});

