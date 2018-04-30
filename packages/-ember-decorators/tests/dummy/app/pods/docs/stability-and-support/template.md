# Stability & Support

Ember Decorators is being used in production apps today, and the library is
fully tested in both Javascript and Typescript. We aim to maintain a stable API
as decorators and class fields evolve through the TC39 process. This means that
we will not make major breaking changes to our APIs _unless_ absolutely required
by changes in the underlying spec.

Class fields are currently stage 3 in the process and decorators are currently
stage 2. Stage 4 marks completion, and the closer a spec is to stage 4, the more
stable it is.

We are currently using the stage 1 transforms for both class fields and
decorators, and awaiting babel updates to use the latest transforms. We do
**not** expect any breaking changes from this upgrade, despite the changes in
the specs.

## Browser Support

Ember Decorators supports the same browser versions that Ember 3 does, IE11+ and
the last two versions of every major browser.

## Ember Support

Ember Decorators currently supports Ember v1.11+. In Ember < 2.13, you must
install the [ember-legacy-class-shim](https://github.com/pzuraq/ember-legacy-class-shim)
addon to ensure that class fields work properly.

## Typescript Support

Typescript decorators differ from the proposed spec in a number of ways. Most
importantly, they cannot access the initializer for class fields, meaning they
have no way of knowing what the value on the right-hand side of a class field
statement is:

```js
class Foo {
  @decorate
  bar = 'baz'; // @decorate cannot know that the value 'baz' will be assigned to bar
}
```

Fortunately, all of the core decorators in this library are fully compatible
with both Javascript and Typescript. Other libraries in the Ember Decorators
project, such as [@ember-decorators/argument](https://github.com/ember-decorators/argument),
rely on the above functionality and are not compatible with Typescript at the
moment.

Typescript will reimplement their own decorator transform when decorators reach
stage 3 in the TC39 process. In the meantime, we'll continue to provide
interoperability where possible.
