import { module, test } from 'qunit';
import { alias as emberAlias } from '@ember/object/computed';
import { computed } from '@ember-decorators/utils/compatibility';
import { computedDecorator, computedDecoratorWithRequiredParams } from '@ember-decorators/utils/computed';
import { computedDescriptorFor, isComputedDescriptor } from '@ember-decorators/utils/-private/descriptor';

module('computed decorator helpers', function() {

  module('computedDecorator', function() {

    test('it works', function(assert) {
      let decorate = computedDecorator((target, key, { get, set }) => {
        return computed({ get, set });
      });

      class Foo {
        @decorate
        get foo() {}

        set foo(value) {}
      }

      assert.ok(isComputedDescriptor(computedDescriptorFor(Foo.prototype, 'foo')), 'descriptor correctly assigned');
    });

    test('it works on fields', function(assert) {
      let alias = computedDecoratorWithRequiredParams((target, key, desc, params) => {
        return emberAlias(...params);
      });

      class Foo {
        @alias('foo') bar;
      }

      assert.ok(isComputedDescriptor(computedDescriptorFor(Foo.prototype, 'bar')), 'descriptor correctly assigned');
    });

    test('it works on functions', function(assert) {
      let alias = computedDecoratorWithRequiredParams((target, key, desc, params) => {
        return emberAlias(...params);
      });

      class Foo {
        @alias('foo')
        bar() {} // contrived example, it does happen
      }

      assert.ok(isComputedDescriptor(computedDescriptorFor(Foo.prototype, 'bar')), 'descriptor correctly assigned');
    });

    test('it passes in the previous computed descriptor if it exists', function(assert) {
      let decorate = computedDecorator((target, key, { get, set }) => {
        return computed({ get, set });
      });

      let decorateAgain = computedDecorator((target, key, desc) => {
        assert.ok(isComputedDescriptor(desc), 'computed descriptor passed in correctly');

        return desc;
      });

      class Foo {
        @decorateAgain
        @decorate
        get foo() {}

        set foo(value) {}
      }

      new Foo();
    });

    test('it throws if the decorator does not return a CP descriptor', function(assert) {
      assert.throws(
        () => {
          let decorate = computedDecorator((target, key, desc) => {
            return desc;
          });

          class Foo {
            @decorate
            get foo() {}

            set foo(value) {}
          }

          new Foo();
        },
        /computed decorators must return an instance of an Ember ComputedProperty descriptor/
      );
    });
  });
});
