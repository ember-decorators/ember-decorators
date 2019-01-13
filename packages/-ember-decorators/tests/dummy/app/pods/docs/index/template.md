# Quickstart

## Installation

First, install the package:

```sh
ember install ember-decorators
```

This will add the package, and should also add several babel packages to your
app. You should see the following added to you `package.json`:

```json
"ember-decorators": "{{latest version}}",
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
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  foo: service(),

  bar: computed('someKey', 'otherKey', function() {
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
import { inject as service } from '@ember-decorators/service';

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

The decorators also work with classic class syntax, so you can safely replace
any imports in your app for computed properties, Ember Data attributes, or
injections with the equivalent ember-decorators import and things will continue
to work, allowing you to convert incrementally:

```javascript
import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default Component.extend({
  foo: service(),

  bar: computed('someKey', 'otherKey', function() {
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

The packages in `ember-decorators` are setup to mirror Ember's
[javascript module](https://github.com/emberjs/rfcs/blob/master/text/0176-javascript-module-api.md)
API. Decorators can be imported from the packages that they belong to:

```javascript
import {
  attr,
  hasMany,
  belongsTo,
} from '@ember-decorators/data';

import {
  inject as controller
} from '@ember-decorators/controller';

import {
  action,
  computed,
  observes,
} from '@ember-decorators/object';

import {
  alias,
  or,
  reads,
} from '@ember-decorators/object/computed';

import {
  inject as service
} from '@ember-decorators/service';
```

For a more detailed breakdown on the differences between native classes and the
Ember object model, continue on through the guides.
