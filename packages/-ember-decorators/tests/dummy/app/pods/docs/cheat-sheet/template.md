# Cheat Sheet

This page contains a quick reference of notes and best practices for using
native classes with Ember.

## Installation

* `ember install ember-decorators`
* Troubleshooting
  * Make sure the latest `ember-cli-babel` is installed
  * Make sure `babel-eslint` was installed and set to be the parser in
  `.eslintrc.js`

## Support

* Supports same browsers as Ember,
* Supported on Ember 3.6+ (3.4+ with [native class
  polyfill](https://github.com/pzuraq/ember-native-class-polyfill))
* Supports TS via `ember-cli-typescript`
* Supports stage 1 decorator transforms

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

* Use `super.METHOD_NAME` instead of `this._super()`
* Use `static` instead of `reopenClass`
* When extending from `EmberObject`
  * Create instances using `.create()` - do **not** use `new`
  * Use `init` - do **not** use `constructor`
* When _not_ extending from `EmberObject`
  * Create instances using `new`
  * Use `constructor`
* Do not extend from `EmberObject` when writing non-framework classes (e.g. any
  class that is not a Component, Route, Controller, Service, Model, etc.)

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
* Do _not_ use class fields or constructor assignments for bound functions.
  Instead, use the `@action` decorator from Ember:

  ```js
  // bad
  class Foo extends EmberObject {
    constructor() {
      this.clickHandler = () => this.handleClick();
    }
  }

  // bad
  class Foo extends EmberObject {
    clickHandler = () => this.handleClick();
  }

  // good
  class Foo extends EmberObject {
    @action
    clickHandler() {
      this.handleClick();
    }
  }
  ```

* Class fields get assigned at the beginning of the constructor, or after
  `super`

## Decorators

* Ember provides decorators directly for:
  * Computed Properties and Macros (Including Ember Data)
  * Actions
  * Injections
* Use component decorators to customize a component's element
  * `@layout`
  * `@tagName`
  * `@classNames`
  * `@className`
  * `@attribute`
