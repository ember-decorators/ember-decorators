# @ember-decorators/babel-transforms

[![Build Status](https://travis-ci.org/ember-decorators/babel-transforms.svg)](https://travis-ci.org/ember-decorators/babel-transforms)
[![npm version](https://badge.fury.io/js/%40ember-decorators%2Fbabel-transforms.svg)](https://badge.fury.io/js/%40ember-decorators%2Fbabel-transforms)
[![Greenkeeper badge](https://badges.greenkeeper.io/ember-decorators/babel-transforms.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/ember-decorators/babel-transforms/status.svg)](https://david-dm.org/ember-decorators/babel-transforms)
[![devDependencies Status](https://david-dm.org/ember-decorators/babel-transforms/dev-status.svg)](https://david-dm.org/ember-decorators/babel-transforms?type=dev)

Enables your app or addon to use [decorators](https://github.com/tc39/proposal-decorators) for ES6 classes.

## Installation

#### For apps

```
ember install @ember-decorators/babel-transforms
```

#### For addons

##### Tests and dummy app only

If you're developing an addon and only intend to use decorators in your tests and / or dummy app (`tests/dummy`), just install this addon as a regular `devDependency:`

```
ember install @ember-decorators/babel-transforms
```
You can now use decorators in your `tests/*` directories, but not in your `addon` directory.

##### Internal use only

If you're developing an addon that only uses decorators *interally*, e.g. you don't export any decorators that the user is supposed to use, then it's sufficient to install this addon with the `-S` flag, so it is added as a `dependency` as opposed to the default `devDependency`

```
ember install -S @ember-decorators/babel-transforms
```

In addition to `tests/*`, you can now use decorators in your `addon` directory. However, *do not* make them public API, i.e. *do not* expect the user of you addon to be able to use these decorators.

##### Exporting decorators for the user

If you want to not only employ decorators internally, but also make them public API, so that users of your addon can use your decorators, then the consuming app or addon has to be properly configured for decorator usage.

This means, that users of your addon are required to add `@ember-decorators/babel-transforms` to their project as well. You can either instruct them to do so in your installation instructions and link them here or automatically add the dependency in the [default blueprint](https://ember-cli.com/extending/#default-blueprint) using [`addAddonToProject`](https://ember-cli.com/api/classes/Blueprint.html#method_addAddonToProject):

```js
// blueprints/<your-addon-name>/index.js
module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonToProject('@ember-decorators/babel-transforms'); // is a promise
  }
};
```

You can also add it as a `dependency` (as opposed to the default `devDependency`):

```js
// blueprints/<your-addon-name>/index.js
module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonToProject({
      name: '@ember-decorators/babel-transforms',
      blueprintOptions: { save: true }
    }); // is a promise
  }
};
```

Also, don't forget to add `@ember-decorators/babel-transforms` to your own addon in the first place. :wink:

```
ember install -S @ember-decorators/babel-transforms
```

## Configuration

You can configure this addon in you `ember-cli-build.js` file:

```js
/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
    '@ember-decorators/babel-transforms': {
      disable: false
    }
  });

  return app.toTree();
};
```

The only option is `disable`, which defaults to `false`. If you set `disable` to `true`, Babel will not get configured for decorators.
