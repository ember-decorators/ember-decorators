import { DEBUG } from '@glimmer/env';

import { module, test } from 'qunit';
import { alias as emberAlias } from '@ember/object/computed';
import { computed } from '@ember-decorators/utils/compatibility';
import { computedDecorator, computedDecoratorWithRequiredParams } from '@ember-decorators/utils/computed';
import { computedDescriptorFor, isComputedDescriptor } from '@ember-decorators/utils/-private/descriptor';

module('computed decorator helpers', function() {

  module('computedDecorator', function() {

    test('it works', function(assert) {
      let decorate = computedDecorator(({ descriptor: { get, set } }) => {
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
      let alias = computedDecoratorWithRequiredParams((desc, params) => {
        return emberAlias(...params);
      });

      class Foo {
        @alias('foo') bar;
      }

      assert.ok(isComputedDescriptor(computedDescriptorFor(Foo.prototype, 'bar')), 'descriptor correctly assigned');
    });

    test('it works on functions', function(assert) {
      let alias = computedDecoratorWithRequiredParams((desc, params) => {
        return emberAlias(...params);
      });

      class Foo {
        @alias('foo')
        bar() {} // contrived example, it does happen
      }

      assert.ok(isComputedDescriptor(computedDescriptorFor(Foo.prototype, 'bar')), 'descriptor correctly assigned');
    });

    if (DEBUG) {
      test('it throws if the decorator does not return a CP descriptor', function(assert) {
        assert.throws(
          () => {
            let decorate = computedDecorator((desc) => {
              return desc.descriptor;
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
    }
  });
});
