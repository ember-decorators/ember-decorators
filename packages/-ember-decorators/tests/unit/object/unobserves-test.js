import { module, test } from 'ember-qunit';
import { set } from '@ember/object';

import { observes, unobserves } from '@ember-decorators/object';

module('javascript | @unobserves', function() {

  test('changing the key does not calls the method', function(assert) {
    class Foo {
      @observes('first', 'last')
      fullName() {
        assert.ok(false, 'observer method has been called');
      }
    }

    class Bar extends Foo {
      @unobserves('first', 'last') fullName;
    }

    let obj = new Bar();
    set(obj, 'first', 'yehuda');
    set(obj, 'last', 'katz');

    assert.ok(true, 'observer method has not been called');
  });

  test('it is possible to override the method', function(assert) {
    assert.expect(1);

    class Foo {
      @observes('first', 'last')
      fullName() {
        assert.ok(false, 'old method has been called');
      }
    }

    class Bar extends Foo {
      @unobserves('first', 'last')
      fullName() {
        assert.ok(true, 'new method has been called');
      }
    }

    let obj = new Bar();
    obj.fullName();
  });

  test('throws if decorator params are not provided', function(assert) {
    assert.throws(
      () => {
        class Foo {
          first = 'rob';
          last = 'jackson';

          @observes('first', 'last')
          fullName() {

          }
        }

        class Bar extends Foo {
          @unobserves
          fullName() {
            assert.ok(false, 'method has been called');
          }
        }

        new Bar();
      },
      /Cannot decorate member 'fullName' without parameters/,
    );
  });
});
