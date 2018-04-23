# ember-decorators

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/ember-decorators/ember-decorators.svg?branch=master)](https://travis-ci.org/ember-decorators/ember-decorators)
![Ember Version](https://embadge.io/v1/badge.svg?start=1.11.0)

This addon adds decorator support to Ember, allowing you to DRY-up your code and write modern ES6 classes.

More details:

* [javascript-decorators proposal](https://github.com/wycats/javascript-decorators)
* [babel blog post](http://babeljs.io/blog/2015/03/31/5.0.0/#stage-1:-decorators)

## Usage

### Installation

`ember install ember-decorators`

If you're using **ember-decorators** in an addon, pass the `-S` option to save
this as a `dependency` as opposed to the default `devDependency`:

`ember install -S ember-decorators`

### Application Usage

In your application where you would normally have:

```javascript
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

```javascript
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

The packages in `ember-decorators` are setup to mirror Ember's [javascript module](https://github.com/emberjs/rfcs/blob/master/text/0176-javascript-module-api.md)
API. Decorators can be imported from the packages that they belong to:

```javascript
import {
  attr,
  hasMany,
  belongsTo
} from '@ember-decorators/data';

import {
  controller
} from '@ember-decorators/controller';

import {
  action,
  computed,
  observes
} from '@ember-decorators/object';

import {
  alias,
  or,
  reads
} from '@ember-decorators/object/computed';

import {
  on
} from '@ember-decorators/object/evented';

import {
  service
} from '@ember-decorators/service';

```

See the [API Documentation](https://ember-decorators.github.io/ember-decorators/docs/index.html)
for detailed examples and documentation of the individual decorators.

Note: The `@computed` decorator wraps [ember-macro-helpers](https://github.com/kellyselden/ember-macro-helpers)
which provides a lot of helpful features on top of standard computeds. It is
highly recommended that you read the documentation for that addon as well.

Installation
------------------------------------------------------------------------------

* `git clone <repository-url>` this repository
* `cd ember-decorators`
* `yarn install`

### Linting

* `yarn run lint:js`
* `yarn run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `yarn test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
