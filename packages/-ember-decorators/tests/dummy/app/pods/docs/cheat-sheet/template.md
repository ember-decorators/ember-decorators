# Cheat Sheet

This page contains a quick reference of notes and best practices for using
native classes with Ember.

## Installation

* `ember install ember-decorators`
* Troubleshooting
  * Make sure `@ember-decorators/babel-transforms` was installed
  * Make sure `babel-eslint` was installed and set to be the parser in
  `.eslintrc.js`

## Support

* Supports same browsers as Ember
* Supports Ember 1.11+
* Must install `ember-cli-class-shim` for Ember < 2.13
* Cannot `.extend()` from a native class in Ember < 3.2

## Classes

* Use `class ... extends ...` syntax

  ```js
  class Foo extends EmberObject {}
  ```

* Always name your classes

  ```js
  class extends EmberObject {} // bad
  class Foo extends EmberObject {} // good
  ```

* Create instances using `.create()` - do **not** use `new`
* Use `constructor` - do **not** use `init`
* Use `super` instead of `this._super()`
* Use `static` instead of `reopenClass`

## Class Fields

* Class fields get assigned a value per instance
* Class fields are assigned on the instance, not the prototype
* Use class fields directly over computed properties or constructor assignments
  for assigning new arrays or objects to an instance

  ```js
  // bad
  class Foo extends EmberObject {
    @computed
    get arr() {
      return [];
    }

    constructor() {
      this.obj = {};
    }
  }

  // good
  class Foo extends EmberObject {
    arr = [];
    obj = {};
  }
  ```
* Use class fields over constructor assignments for bound functions

  ```js
  // bad
  class Foo extends EmberObject {
    constructor() {
      this.clickHandler = () => this.handleClick();
    }
  }

  // good
  class Foo extends EmberObject {
    clickHandler = () => this.handleClick();
  }
  ```

* Class fields get assigned at the beginning of the constructor, or after
  `super`
* Class fields will always overwrite values passed into `.create()`, use
  [`_.defaultTo`](https://lodash.com/docs/4.17.5#defaultTo),
  [`@argument`](https://github.com/ember-decorators/argument), or your own
  custom defaulting logic

## Decorators

* Use native getter/setter syntax with `@computed`
* Can no longer clobber computed properties without a setter
* You still must use `set` (and `get` in Ember < 3.1)
* Use `@action` directly on class methods
* Use `@service` and `@controller` to inject
* Use component decorators to customize a component's element
  * `@tagName`
  * `@classNames`
  * `@className`
  * `@attribute`
* Use data decorators to declare attributes and relationships on a model
  * `@attr`
  * `@belongsTo`
  * `@hasMany`

