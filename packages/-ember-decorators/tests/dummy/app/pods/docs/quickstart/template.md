# Quickstart

## Installation

First, install the package:

```sh
ember install ember-decorators
```

This will add the package, and should also add several babel packages to your
app. You should see the following added to you `package.json`:

```json
"@ember-decorators/babel-transforms": "{{latest version}}",
"babel-eslint": "{{latest version}}",
```

And in your `.eslintrc.js`, you should see the following line added:

```
  parser: 'babel-eslint',
```

These packages and settings are necessary for babel and eslint to understand
decorators and class fields and correctly transpile/lint them.

## Usage

Now that the main `ember-decorators` addon is installed, you can import any of
the decorators from its sub-addons. The core of Ember Decorators consists of
many smaller addons namespaced under the `@ember-decorators` scope on NPM,
including:

* `@ember-decorators/component`
* `@ember-decorators/controller`
* `@ember-decorators/data`
* `@ember-decorators/object`
* `@ember-decorators/service`

Now you can write Ember using native classes! For example, this:

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

Turns into this:

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

The packages in `ember-decorators` are setup to mirror Ember's
[javascript module](https://github.com/emberjs/rfcs/blob/master/text/0176-javascript-module-api.md)
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

For a more detailed breakdown on the differences between native classes and the
Ember object model, continue on through the guides.
