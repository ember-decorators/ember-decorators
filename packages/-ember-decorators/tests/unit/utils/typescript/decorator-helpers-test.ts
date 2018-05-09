import { module, test } from 'qunit';
import { decoratorWithParams, decoratorWithRequiredParams } from '@ember-decorators/utils/decorator';

module('decorator helpers - typescript', function() {

  module('decoratorWithParams', function() {

    test('it works with params', function(assert) {
      let decorate = decoratorWithParams((target, key, desc, params) => {
        assert.equal(key, 'foo', 'correct key decorated');
        assert.ok(Array.isArray(params), 'array passed in as params');
        assert.equal(params.length, 1, 'params list has correct number of params');
        assert.equal(params[0], 'bar', 'params passed correctly');
      });

      class Foo {
        @decorate('bar') foo() {}
      }

      new Foo();
    });

    test('it works without params', function(assert) {
      let decorate = decoratorWithParams((target, key, desc, params) => {
        assert.equal(key, 'foo', 'correct key decorated');
        assert.ok(Array.isArray(params), 'array passed in as params');
        assert.equal(params.length, 0, 'params list is empty');
      });

      class Foo {
        @decorate foo() {}
      }

      new Foo();
    });

    test('it works with empty params list', function(assert) {
      let decorate = decoratorWithParams((target, key, desc, params) => {
        assert.equal(key, 'foo', 'correct key decorated');
        assert.ok(Array.isArray(params), 'array passed in as params');
        assert.equal(params.length, 0, 'params list is empty');
      });

      class Foo {
        @decorate() foo() {}
      }

      new Foo();
    });
  });

  module('decoratorWithRequiredParams', function() {

    test('it works with params', function(assert) {
      let decorate = decoratorWithRequiredParams((target, key, desc, params) => {
        assert.equal(key, 'foo', 'correct key decorated');
        assert.ok(Array.isArray(params), 'array passed in as params');
        assert.equal(params.length, 1, 'params list has correct number of params');
        assert.equal(params[0], 'bar', 'params passed correctly');
      });

      class Foo {
        @decorate('bar') foo() {}
      }

      new Foo();
    });

    test('it throws without params', function(assert) {
      assert.throws(
        () => {
          let decorate = decoratorWithRequiredParams(() => {
            assert.ok(false, 'decorator ran');
          });

          class Foo {
            // @ts-ignore
            @decorate foo() {}
          }

          new Foo();
        },
        /Cannot decorate member 'foo' without parameters/
      );
    });

    test('it throws with empty params list', function(assert) {
      assert.throws(
        () => {
          let decorate = decoratorWithRequiredParams(() => {
            assert.ok(false, 'decorator ran');
          });

          class Foo {
            @decorate() foo() {}
          }

          new Foo();
        },
        /Cannot decorate member 'foo' without parameters/
      );
    });

    test('it works on fields', function(assert) {
      assert.expect(2);

      let decorate = decoratorWithParams((target, key, desc, params) => {
        assert.ok(true, 'decorator called');
      });

      class Foo {
        @decorate bar;
        @decorate('foo') baz;
      }
    });
  });
});
