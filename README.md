# ember-decorators

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/rwjblue/ember-decorators.svg?branch=master)](https://travis-ci.org/rwjblue/ember-decorators)
![Ember Version](https://embadge.io/v1/badge.svg?start=2.4.0)

This addon adds decorator support to Ember, allowing you to DRY-up your code and write modern ES6 classes.

More details:

* [javascript-decorators proposal](https://github.com/wycats/javascript-decorators)
* [babel blog post](http://babeljs.io/blog/2015/03/31/5.0.0/#stage-1:-decorators)

## Usage

### Babel Setup

To use ember-decorators you must update Babel's configuration to
allow usage of the decorator proposal.

#### Babel 6.x

Babel 6 has split out the various transforms to plugins, so we need to install the plugins for decorators:

```
yarn add --dev babel-plugin-transform-decorators-legacy
yarn add --dev babel-plugin-transform-class-properties # needed for ES6 class syntax
```

Or if you're using NPM:

```
npm install --save-dev babel-plugin-transform-decorators-legacy
npm install --save-dev babel-plugin-transform-class-properties
```

Now simply tell Babel to use these plugins:

```javascript
// ember-cli-build.js
var app = new EmberApp({
  babel: {
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties'
    ]
  }
});
```

#### Babel 5.x

As of Babel 5.1.0 the following should be all you need in your ember-cli application:

* pre-1.13.0
```javascript
// Brocfile.js
var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});
```

* 1.13.x
```javascript
// ember-cli-build.js
var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});
```

#### Setup with addon

Add the following `init` method to `index.js` of your addon.
This should enable the decorators to work on the parent app/addon. Use version below that corresponds with your Babel 5.x addon or your Babel 6.x addon.

```javascript
  // Babel 5.x version
  init: function(app) {
    this._super.init && this._super.init.apply(this, arguments);

    this.options = this.options || {};
    this.options.babel = this.options.babel || {};
    this.options.babel.optional = this.options.babel.optional || [];

    if (this.options.babel.optional.indexOf('es7.decorators') === -1) {
      this.options.babel.optional.push('es7.decorators');
    }
  }

  // ~~ OR ~~

  // Babel 6.x version
  init: function(app) {
    this._super.init && this._super.init.apply(this, arguments);

    this.options = this.options || {};
    this.options.babel = this.options.babel || {};
    this.options.babel.plugins = this.options.babel.plugins || [];

    if (this.options.babel.plugins.indexOf('transform-decorators-legacy') === -1) {
      this.options.babel.plugins.push('transform-decorators-legacy');
    }

    if (this.options.babel.plugins.indexOf('transform-class-properties') === -1) {
      this.options.babel.plugins.push('transform-class-properties');
    }
  }
```

### Application Usage

In your application where you would normally have:

```javascript
import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.inject.service(),

  bar: Ember.computed('someKey', 'otherKey', function() {
    var someKey = this.get('someKey');
    var otherKey = this.get('otherKey');

    // do stuff
  }),

  actions: {
    handleClick() {
      // do stuff
    }
  }
})

```

You replace it with this:

```javascript
import Ember from 'ember'
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default class MyComponent extends Ember.Component {
  @service foo

  @computed('someKey', 'otherKey')
  bar(someKey, otherKey) {
    // do stuff
  }

  @action
  handleClick() {
    // do stuff
  }
}

```

The packages in `ember-decorators` are setup to mirror Ember's [javascript module](https://github.com/emberjs/rfcs/blob/master/text/0176-javascript-module-api.md)
API. Decorators can be imported from the packages that they belong to:

```javascript
import {
  attr,
  hasMany,
  belongsTo
} from 'ember-decorators/data';

import {
  controller
} from 'ember-decorators/controller';

import {
  action,
  computed,
  observes
} from 'ember-decorators/object';

import {
  alias,
  or,
  reads
} from 'ember-decorators/object/computed';

import {
  on
} from 'ember-decorators/object/evented';

import {
  service
} from 'ember-decorators/service';

```

See the [API Documentation](https://rwjblue.github.io/ember-decorators/docs/index.html)
for detailed examples and documentation of the individual decorators.

Note: The `@computed` decorator wraps [ember-macro-helpers](https://github.com/kellyselden/ember-macro-helpers)
which provides a lot of helpful features on top of standard computeds. It is
highly recommended that you read the documentation for that addon as well.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-decorators`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
