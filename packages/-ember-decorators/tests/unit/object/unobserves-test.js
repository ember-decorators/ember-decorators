import { DEBUG } from '@glimmer/env';
import { NEEDS_STAGE_1_DECORATORS } from 'ember-decorators-flags';

import { module, test } from 'ember-qunit';
import EmberObject, { set } from '@ember/object';

import { observes, unobserves } from '@ember-decorators/object';

module('@unobserves', function() {

  test('changing the key does not calls the method', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
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
  });

  test('it is possible to override the method', function(assert) {
    assert.expect(1);

    class Foo extends EmberObject {
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

  test('it works with expanded/chained properties on EmberObject based classes', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      init() {
        super.init(...arguments);

        this.person = {};
      }

      @observes('person.{first,last}')
      fullName() {
        assert.ok(false, 'observer method has been called');
      }
    }

    class Bar extends Foo {
      @unobserves('person.{first,last}') fullName;
    }

    let obj = new Bar();
    set(obj, 'person.first', 'yehuda');
    set(obj.person, 'last', 'katz');
  });

  if (!NEEDS_STAGE_1_DECORATORS) {
    test('it works with expanded/chained properties on plain classes', function(assert) {
      assert.expect(0);

      class Foo {
        person = {};

        @observes('person.{first,last}')
        fullName() {
          assert.ok(false, 'observer method has been called');
        }
      }

      class Bar extends Foo {
        @unobserves('person.{first,last}') fullName;
      }

      let obj = new Bar();
      set(obj, 'person.first', 'yehuda');
      set(obj.person, 'last', 'katz');
    });
  }

  if (DEBUG) {
    test('throws if decorator params are not provided', function(assert) {
      assert.throws(
        () => {
          class Foo extends EmberObject {
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
        /The @unobserves decorator requires parameters/,
      );
    });
  }
});
