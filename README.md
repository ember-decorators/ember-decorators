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
