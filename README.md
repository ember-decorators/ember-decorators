Ember Decorators
==============================================================================

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/ember-decorators/ember-decorators.svg?branch=master)](https://travis-ci.org/ember-decorators/ember-decorators)

Ember Decorators is a project dedicated to exploring and unlocking the future
of native classes in Ember.js. Its goal is to provide a set of decorators which
can be used to write native classes with every standard feature that is
available in Ember, along with the transforms and build system required to
polyfill and ship them in your app today!

The [documentation website](https://ember-decorators.github.io/ember-decorators)
for Ember Decorators contains a detailed guide on using native classes with
Ember today, along with detailed API documentation for all the decorators
included in this library.

Usage
------------------------------------------------------------------------------

First install the main `ember-decorators` addon.

```sh
ember install ember-decorators
```

This addon doesn't contain any decorators itself, but includes the core set of
subaddons that are necessary to begin writing Ember using native classes:

* `@ember-decorators/component`
* `@ember-decorators/controller`
* `@ember-decorators/data`
* `@ember-decorators/object`
* `@ember-decorators/service`

### Usage in Applications

In your application where you would normally have:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.inject.service(),

  bar: Ember.computed('someKey', 'otherKey', function() {
    var someKey = this.get('someKey');
    var otherKey = this.get('otherKey');

    return `${someKey} - ${otherKey}`;
  }),

  actions: {
    handleClick() {
      // do stuff
    }
  }
})

```

You replace it with this:

```js
import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class ExampleComponent extends Component {
  @service foo

  @computed('someKey', 'otherKey')
  get bar() {
    const someKey = this.get('someKey');
    const otherKey = this.get('otherKey');
    return `${someKey} - ${otherKey}`;
  }

  @action
  handleClick() {
    // do stuff
  }
}
```

See the [API Documentation](https://ember-decorators.github.io/ember-decorators)
for detailed examples and documentation of the individual decorators.

Development
------------------------------------------------------------------------------

### Specs

Ember Decorators follows the [current decorators "stage 2" proposal specs](https://github.com/tc39/proposal-decorators).
The [`@ember-decorators/utils`](https://github.com/ember-decorators/ember-decorators/tree/master/packages/utils)
package normalizes the preceding [legacy decorators "stage 1" proposal API](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#why-legacy)
to the current one, so that you don't have to worry about it. :hugs:

These two documents from the spec repo are especially helpful:

- [`METAPROGRAMMING.md`](https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md):
  how to write and use decorators
- [`TABLE.md`](https://github.com/tc39/proposal-decorators/blob/master/TABLE.md):
  detailed API docs for the decorator input parameter and output return value

[`@ember-decorators/babel-transforms`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/)
is responsible for transforming decorators and class properties in your code to
JavaScript that can run in today's browsers. For this we use these plugins:

- [`@babel/plugin-proposal-decorators`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
- [`@babel/plugin-proposal-class-properties`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)

Check the
[`package.json`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/package.json)
to see what version of the transforms we are currently using. For information on
the spec compliancy of the transforms, see the Babel issue tracker:

- [Spec: "Decorators"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Decorators%22)
- [Spec: "Class Fields"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Class+Fields%22)

### Organization

This repository consists of multiple packages managed with [lerna.js](https://lernajs.io/).
The decorators all reside in their own individual packages under `/packages`,
along with the main `ember-decorators` package.

The main package serves three purposes:

1. A quick way to install all of the subpackages and get new projects up and
  running. Installing the main package also adds any necessary babel transforms,
  and sets up ESLint properly.
2. A place for common functionality, such as the native class blueprints that
  overwrite the default Ember blueprints.
3. A place for the documentation site and tests for all of the other addons.
  Tests were consolidated from the other addons in order to speed up the testing
  and development process.

### Setting up

* Fork the repository
* `git clone <your-fork-url>`
* `cd ember-decorators`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `npm test` – Runs the test suite on the current Ember version

### Running the dummy application

* `npm start`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
