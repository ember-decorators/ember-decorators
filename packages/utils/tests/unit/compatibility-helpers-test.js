import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { computed } from '@ember-decorators/utils/compatibility';

module('compatibility helpers', function() {

  module('computed', function() {

    test('can use new syntax', function(assert) {
      let foo = EmberObject.extend({
        bar: computed({
          get() {
            assert.ok(true, 'getter called correctly');
          },

          set(key, value) {
            assert.equal(value, 'baz', 'setter called with correct value');
          }
        })
      }).create();

      foo.get('bar');
      foo.set('bar', 'baz');
    });

    test('dependent keys passed correctly to computed', function(assert) {
      let foo = EmberObject.extend({
        foo: 123,

        bar: computed('foo', {
          get() {
            return this.get('foo');
          }
        })
      }).create();

      assert.equal(foo.get('bar'), 123);
      foo.set('foo', 456);
      assert.equal(foo.get('bar'), 456);
    });
  });
});
