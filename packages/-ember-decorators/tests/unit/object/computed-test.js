import { module, test } from 'ember-qunit';
import { get, set, setProperties } from '@ember/object';

import { computed, readOnly, volatile, observes } from '@ember-decorators/object';

import { gte } from 'ember-compatibility-helpers';
import { THROW_ON_COMPUTED_OVERRIDE } from 'ember-decorators-flags';

module('javascript | @computed', function() {

  test('it works', function(assert) {
    assert.expect(2);

    class Foo {
      first = 'rob';
      last = 'jackson';

      @computed('first', 'last')
      get fullName() {
        assert.equal(this.first, 'rob');
        assert.equal(this.last, 'jackson');
      }
    }

    let obj = new Foo();
    get(obj, 'fullName');
  });

  test('works with getter and setter', function(assert) {
    assert.expect(6);

    let expectedName = 'rob jackson';
    let expectedFirst = 'rob';
    let expectedLast = 'jackson';

    class Foo {
      constructor() {
        this.first = 'rob';
        this.last = 'jackson';
      }

      @computed('first', 'last')
      get fullName() {
        assert.equal(this.first, expectedFirst, 'getter: first name matches');
        assert.equal(this.last, expectedLast, 'getter: last name matches');
        return `${this.first} ${this.last}`;
      }

      set fullName(name) {
        assert.equal(name, expectedName, 'setter: name matches');

        const [first, last] = name.split(' ');
        setProperties(this, { first, last });
      }
    }

    let obj = new Foo();
    get(obj, 'fullName');

    expectedName = 'yehuda katz';
    expectedFirst = 'yehuda';
    expectedLast = 'katz';
    set(obj, 'fullName', 'yehuda katz');

    assert.strictEqual(get(obj, 'fullName'), expectedName, 'return value of getter is new value of property');
  });

  test('dependent key changes invalidate the computed property', function(assert) {
    class Foo {
      first = 'rob';
      last = 'jackson';

      @computed('first', 'last')
      get name() {
        return `${this.first} ${this.last}`;
      }
    }

    let obj = new Foo();

    assert.equal(get(obj, 'name'), 'rob jackson');
    set(obj, 'first', 'al');
    assert.equal(get(obj, 'name'), 'al jackson');
  });

  test('only calls getter when dependent keys change', function(assert) {
    let callCount = 0;
    class Foo {
      first = 'rob';
      last = 'jackson';

      @computed('first', 'last')
      get name() {
        callCount++;
      }
    }

    let obj = new Foo();

    get(obj, 'name');
    assert.equal(callCount, 1);

    get(obj, 'name');
    assert.equal(callCount, 1);

    set(obj, 'first', 'al');
    get(obj, 'name');
    assert.equal(callCount, 2);
  });

  test('throws if used on non-getters', function(assert) {
    assert.throws(
      () => {
        class Foo {
          constructor() {
            this.first = 'rob';
            this.last = 'jackson';
          }

          @computed('first', 'last')
          fullName() {
            assert.equal(this.first, 'rob');
            assert.equal(this.last, 'jackson');
          }
        }

        new Foo();
      },
      /Attempted to apply @computed to fullName, but it is not a native accessor function/
    );
  });

  test('throws if a setter was defined without a getter', function(assert) {
    assert.throws(
      () => {
        // eslint-disable-next-line
        class Foo {
          @computed
          set fullName(name) {}
        }
      },
      /Using @computed for only a setter does not make sense\. Add a getter for 'fullName' as well or remove the @computed decorator./
    );
  });

  test('return value of ES6 setter is not required, but is not ignored', function(assert) {
    class Foo {
      constructor() {
        this.first = 'rob';
        this.last = 'jackson';
      }

      @computed('first', 'last')
      get fullNameNoReturn() {
        return `${this.first} ${this.last}`;
      }

      set fullNameNoReturn(name) {
        const [first, last] = name.split(' ');
        setProperties(this, { first, last });
      }

      @computed('first', 'last')
      get fullNameWithReturn() {
        return `${this.first} ${this.last}`;
      }

      set fullNameWithReturn(name) {
        const [first, last] = name.split(' ');
        setProperties(this, { first, last });

        return 'something else';
      }
    }

    let obj = new Foo();

    set(obj, 'fullNameNoReturn', 'yehuda katz');
    assert.strictEqual(get(obj, 'fullNameNoReturn'), 'yehuda katz', 'return value of setter is not required, if there is a getter');


    set(obj, 'fullNameWithReturn', 'tom dale');
    assert.strictEqual(get(obj, 'fullNameWithReturn'), 'something else', 'if the setter returns a value, it is not ignored');
  });

  test('throws if the same property is decorated more than once', function(assert) {
    assert.throws(
      () => {
        class Foo {
          @computed
          @computed('foo')
          get fullName() {}

          set fullName(name) {}
        }

        new Foo();
      },
      /ES6 property getters\/setters only need to be decorated once, 'fullName' was decorated on both the getter and the setter/
    );
  });

  test('can decorate the same property in multiple subclasses', function(assert) {
    assert.expect(0);

    class Foo {
      @computed('bar')
      get fullName() {}
    }

    class Bar extends Foo {
      @computed('foo')
      get fullName() {}
    }

    class Baz extends Foo {
      @computed('bar')
      get fullName() {}
    }

    // shouldn't cause any errors
    new Foo();
    new Bar();
    new Baz();
  });

  if (THROW_ON_COMPUTED_OVERRIDE) {
    test('it throws if user attempts to override the computed', function(assert) {
      assert.throws(
        () => {
          class Foo {
            first = 'rob';
            last = 'jackson';

            @computed('first', 'last')
            get name() {
              return `${this.first} ${this.last}`;
            }
          }

          let foo = new Foo();

          set(foo, 'name', 'bar');
        },
        /Assertion Failed: Attempted to set name, but it does not have a setter. Overriding a computed property without a setter has been deprecated./
      );
    });
  }

  module('modifiers', function() {
    if (gte('2.0.0')) {
      test('volatile', function(assert) {
        assert.expect(2);
        class Foo {
          _count = 0;

          @volatile
          @computed('first')
          get counter() {
            return this._count++;
          }
            set counter(value) {
            this._count = value;
          }

          @observes('counter')
          countObserver() {
            assert.ok(false, 'observer called')
          }
        }

        let obj = new Foo();
        assert.equal(get(obj, 'counter'), 0, 'getter works');
        assert.equal(get(obj, 'counter'), 1, 'getter called each time');

        set(obj, 'counter', 2);
      });

      test('volatile can be applied in any order', (assert) => {
        assert.expect(2);
        class Foo {
          _count = 0;

          @computed('first')
          @volatile
          get counter() {
            return this._count++;
          }
            set counter(value) {
            this._count = value;
          }

          @observes('counter')
          countObserver() {
            assert.ok(false, 'observer called')
          }
        }

        let obj = new Foo();
        assert.equal(get(obj, 'counter'), 0, 'getter works');
        assert.equal(get(obj, 'counter'), 1, 'getter called each time');

        set(obj, 'counter', 2);
      });

      if (THROW_ON_COMPUTED_OVERRIDE) {
        test('readOnly', function(assert) {
          assert.throws(() => {
            class Foo {
              first = 'rob';
              last = 'jackson';

              @readOnly
              @computed('first', 'last')
              get name() {
                return `${this.first} ${this.last}`;
              }
            }

            let obj = new Foo();

            set(obj, 'name', 'al');
          }, /Computed properties that define a setter using the new syntax cannot be read-only/);
        });
      } else {
        test('readOnly', function(assert) {
          class Foo {
            first = 'rob';
            last = 'jackson';

            @readOnly
            @computed('first', 'last')
            get name() {
              return `${this.first} ${this.last}`;
            }
          }

          let obj = new Foo();

          assert.throws(() => {
            set(obj, 'name', 'al');
          }, /Cannot set read-only property "name" on object: {first: rob, last: jackson}/);
        });

        test('readOnly can be applied in any order', function(assert) {
          class Foo {
            first = 'rob';
            last = 'jackson';

            @computed('first', 'last')
            @readOnly
            get name() {
              return `${this.first} ${this.last}`;
            }
          }

          let obj = new Foo();

          assert.throws(() => {
            set(obj, 'name', 'al');
          }, /Cannot set read-only property "name" on object: {first: rob, last: jackson}/);
        });

        test('volatile and readOnly cannot be applied together', (assert) => {
          assert.throws(() => {
            class Foo {
              first = 'rob';
              last = 'jackson';

              @volatile
              @computed('first', 'last')
              @readOnly
              get name() {
                return `${this.first} ${this.last}`;
              }
            }

            let obj = new Foo();

            set(obj, 'name', 'al');
          }, /A computed property cannot be both readOnly and volatile. Use a native getter instead/);
        });
      }
    }
  });
});

