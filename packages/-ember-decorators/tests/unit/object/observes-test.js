import { module, test } from 'ember-qunit';
import { set } from '@ember/object';

import { observes } from '@ember-decorators/object';

module('@observes', function() {

  test('it calls the method', function(assert) {
    assert.expect(4);

    let i = 0;

    class Foo {
      @observes('first', 'last')
      fullName() {
        [
          () => {
            assert.equal(this.first, 'yehuda');
            assert.equal(this.last, undefined);
          },
          () => {
            assert.equal(this.first, 'yehuda');
            assert.equal(this.last, 'katz');
          },
        ][i++]();
      }
    }

    let obj = new Foo();
    set(obj, 'first', 'yehuda');
    set(obj, 'last', 'katz');
  });

  test('it calls the method only when dependent keys changed', function(assert) {
    assert.expect(4);

    let callCount = 0;

    class Foo {
      first = 'rob';
      last = 'jackson';

      @observes('first', 'last')
      fullName() {
        ++callCount;
      }
    }

    let obj = new Foo();
    assert.equal(callCount, 0);
    set(obj, 'first', 'yehuda');
    assert.equal(callCount, 1);
    set(obj, 'last', 'katz');
    assert.equal(callCount, 2);
    set(obj, 'last', 'yehuda');
    assert.equal(callCount, 3);
  });

  test('throws if used on non-function', function(assert) {
    assert.throws(
      () => {
        class Foo {
          constructor() {
            this.first = 'rob';
            this.last = 'jackson';
          }

          @observes('first', 'last')
          fullName = 'rob jackson';
        }

        new Foo();
      },
      /The @observes decorator must be applied to functions/,
      'throws on field'
    );

    assert.throws(
      () => {
        class Foo {
          constructor() {
            this.first = 'rob';
            this.last = 'jackson';
          }

          @observes('first', 'last')
          get fullName() {
            assert.ok(false, 'getter has been called');
            return 'rob jackson';
          }
        }

        new Foo();
      },
      /The @observes decorator must be applied to functions/,
      'throws on getter'
    );

    assert.throws(
      () => {
        class Foo {
          constructor() {
            this.first = 'rob';
            this.last = 'jackson';
          }

          @observes('first', 'last')
          set fullName(value) {
            assert.ok(false, `setter has been called (value: ${value}`);
          }
        }

        new Foo();
      },
      /The @observes decorator must be applied to functions/,
      'throws on setter'
    );
  });

  test('throws if decorator params are not provided', function(assert) {
    assert.throws(
      () => {
        class Foo {
          constructor() {
            this.first = 'rob';
            this.last = 'jackson';
          }

          @observes
          fullName() {
            assert.ok(false, 'method has been called');
          }
        }

        new Foo();
      },
      /The @observes decorator requires parameters/
    );
  })
});
