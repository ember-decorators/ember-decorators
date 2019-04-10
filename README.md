Ember Decorators
==============================================================================

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/ember-decorators/ember-decorators.svg?branch=master)](https://travis-ci.org/ember-decorators/ember-decorators)

Ember Decorators began as a project dedicated to exploring and unlocking the 
future of native classes in Ember.js. Now, that future is here! Decorators will
be landing soon in Ember, and there is a [polyfill available for 
them](https://github.com/pzuraq/ember-decorators-polyfill).

This library now contains a few extra decorators which were not upstreamed to 
Ember, and may still be useful to some users. Check out the [documentation 
website](https://ember-decorators.github.io/ember-decorators) for detailed API 
documentation for all the decorators included in this addon.

Usage
------------------------------------------------------------------------------

First install the main `ember-decorators` addon.

```sh
ember install ember-decorators
```

This addon doesn't contain any decorators itself, but includes the core set of
subaddons that are necessary to begin writing Ember using native classes:

* `@ember-decorators/component`
* `@ember-decorators/object`

See the [API Documentation](https://ember-decorators.github.io/ember-decorators)
for detailed examples and documentation of the individual decorators.

Development
------------------------------------------------------------------------------

### Specs

Ember follows the [legacy decorators "stage 1" proposal API](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#why-legacy). 
The decorators proposal is currently being redesigned for stage 3, and the
champions have [publicly stated that this is the recommended path forward](https://github.com/tc39/proposal-decorators#how-should-i-use-decorators-in-transpilers-today).

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
