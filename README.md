# ember-computed-decorators

[![npm version](https://badge.fury.io/js/ember-computed-decorators.svg)](https://badge.fury.io/js/ember-computed-decorators)
[![Build Status](https://travis-ci.org/rwjblue/ember-computed-decorators.svg?branch=master)](https://travis-ci.org/rwjblue/ember-computed-decorators)
![Ember Version](https://embadge.io/v1/badge.svg?start=2.4.0)

This addon allows usage of the proposed decorator syntax, and passes the specified
dependent keys into your computed function making your computed properties much DRY'er.

More details:

* [javascript-decorators proposal](https://github.com/wycats/javascript-decorators)
* [babel blog post](http://babeljs.io/blog/2015/03/31/5.0.0/#stage-1:-decorators)

## Usage

### Babel Setup

To use ember-computed-decorators you must update Babel's configuration to
allow usage of the decorator proposal.

#### Babel 6.x

Babel 6 has split out the various transforms to plugins, so we need to install the plugin for decorators:

```
yarn add --dev babel-plugin-transform-decorators-legacy
```

Or if you're using NPM:

```
npm install --save-dev babel-plugin-transform-decorators-legacy
```

Now simply tell Babel to use this plugin:

```javascript
// ember-cli-build.js
var app = new EmberApp({
  babel: {
    plugins: ['transform-decorators-legacy']
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
  }
```

### Application Usage

In your application where you would normally have:

```javascript
foo: Ember.computed('someKey', 'otherKey', function() {
  var someKey = this.get('someKey');
  var otherKey = this.get('otherKey');
  // Do Stuff
})
```

You replace with this:

```javascript
import computed from 'ember-computed-decorators';
// ..... <snip> .....
@computed('someKey', 'otherKey')
foo(someKey, otherKey) {
  // Do Stuff
}
```

#### Without Dependent Keys

```javascript
foo: Ember.computed(function() {
  // Do Stuff
})
```
You replace with this:
```javascript
import computed from 'ember-computed-decorators';
// ..... <snip> .....
@computed
foo() {
  // Do Stuff
}
```

#### "Real World"

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';
export default Ember.Component.extend({
  @computed('first', 'last')
  name(first, last) {
    return `${first} ${last}`;
  }
});
```

#### "Real World get/set syntax"

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';
export default Ember.Component.extend({
  @computed('first', 'last')
  name: {
    get(first, last) {
      return `${first} ${last}`;
    },
    set(value, first, last) {
      // ...
    }
  }
});
```

See the [API Documentation](rwjblue.github.io/ember-computed-decorators/docs/index.html)
for detailed examples and documentation of the individual decorators.

Note: The `@computed` decorator wraps [ember-macro-helpers](https://github.com/kellyselden/ember-macro-helpers)
which provides a lot of helpful features on top of standard computeds. It is
highly recommended that you read the documentation for that addon as well.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-computed-decorators`
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
