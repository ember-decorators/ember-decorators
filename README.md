# ember-computed-decorators

This addon allows usage of the proposed decorator syntax, and passes the specified
dependent keys into your computed function making your computed properties much DRY'er.

More details:

* [javascript-decorators proposal](https://github.com/wycats/javascript-decorators)
* [babel blog post](http://babeljs.io/blog/2015/03/31/5.0.0/#stage-1:-decorators)

## Usage

### Babel Setup

To use ember-computed-decorators you must update Babel's configuration to
allow usage of the decorator proposal.

As of Babel 5.1.0 the following should be all you need in your ember-cli application:

```javascript
// Brocfile.js
var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});
```

### Application Usage

#### With Dependent Keys

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
import computedDecorator from 'ember-computed-decorators';

// ..... <snip> .....
@computedDecorator('someKey', 'otherKey')
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
import computedDecorator from 'ember-computed-decorators';

// ..... <snip> .....
@computedDecorator
foo() {
  // Do Stuff
}

```

#### "Real World"

```javascript
import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Computed.extend({
  @computed('first', 'last')
  name(first, last) {
    return `${first} ${last}`;
  }
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
