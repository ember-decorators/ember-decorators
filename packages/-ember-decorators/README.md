ember-decorators
==============================================================================

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/ember-decorators/ember-decorators.svg?branch=master)](https://travis-ci.org/ember-decorators/ember-decorators)

Ember Decorators is a project dedicated to exploring and unlocking the future
of native classes in Ember.js. Its goal is to provide a set of decorators which
can be used to write native classes with every standard feature that is
available in Ember, along with the transforms and build system required to
polyfill and ship them in your app today!

This addon is the main `ember-decorators` addon which includes all of the other
core Ember Decorators addons. Checkout the [documentation website](https://ember-decorators.github.io/ember-decorators)
for detailed guides on using native classes with Ember today, along with
detailed API documentation for all the decorators included in this library.

Installation
------------------------------------------------------------------------------

The addon is split into `object` and `component` decorators:
* `@ember-decorators/component`
* `@ember-decorators/object`

You can run the following command to install both packages:

```sh
npm install @ember-decorators/component @ember-decorators/object -D
```

> [!NOTE]
> If you're coming from v6 and earlier, the meta package `ember-decorators` no longer transitively ships the individual packages for your apps. You must install them directly.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
