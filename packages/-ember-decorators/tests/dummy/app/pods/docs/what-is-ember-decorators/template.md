# What is Ember Decorators?

Ember Decorators is a project dedicated to exploring and unlocking usage of
native classes in Ember.js. It provides:

1. A set of decorators that matches the ones proposed in the [Decorators
   RFC](https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md),
   which will be shipped in Ember in the near future.
2. Additional decorators for features that will _not_ be included in Ember
   directly. These include decorators for event listeners and observers, and for
   customizing classic Ember components (e.g. `@attribute` and `@tagName`).

## Why do I need decorators to use native classes?

Native classes have been around since ES2015, so why haven't we been able to use
them with Ember all this time? While `class` syntax has existed for a long time
now, using it with Ember was difficult because it lacked a way to:

1. Declare properties and give them values, e.g.

  ```js
  Ember.Object.extend({
    foo: 123,
    classNames: ['is-active']
  });
  ```

2. Specify meta behavior declaritively for methods, getters, setters, and
properties. This is something the Ember object-model has supported
out-of-the-box since the early days with computed properties, observers, event
listeners, and so on, e.g.

  ```js
  Ember.Object.extend({
    foo: computed('qux', {
      get() {
        return 123;
      }
    }),

    bar: observer('qux', function() {
      // do something
    }),

    baz: on('init', function() {
      // do something else
    })
  });
  ```

[Class fields](https://github.com/tc39/proposal-class-fields) and
[decorators](https://github.com/tc39/proposal-decorators) solve each of these
problems respectively, and give us the tools to do a nearly 1-to-1 conversion
from the old Ember objects to native classes. While it is technically possible
to use native classes without class fields or decorators, the DX of doing this
is incredibly low - its a long, error prone, and somewhat non-performant
process.


