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
"babel-eslint": "{{latest version}}",
```

And in your `.eslintrc.js`, you should see the following line added:

```
  parser: 'babel-eslint',
```

These packages and settings are necessary for babel and eslint to understand
decorators and class fields and correctly transpile/lint them. You should also
ensure that you are using at least `ember-cli-babel@v7.7.3`, since it adds
support for class fields and decorators.

## Usage

Now that the main `ember-decorators` addon is installed, you can import any of
the decorators from its sub-addons. The core of Ember Decorators consists of
many smaller addons namespaced under the `@ember-decorators` scope on NPM,
including:

- `@ember-decorators/component`
- `@ember-decorators/object`

Now you can write Ember using native classes! For example, this:

```javascript
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'a',
  classNameBindings: ['bar']


  bar: computed('someKey', 'otherKey', function() {
    return `.${this.someKey}__${this.otherKey}`;
  }),
})
```

Turns into this:

```javascript
import Component from '@ember/component';
import { computed } from '@ember/object';
import { tagName, className } from '@ember/component';

@tagName('a')
export default class ExampleComponent extends Component {
  @className
  @computed('someKey', 'otherKey')
  get bar() {
    return `.${this.someKey}__${this.otherKey}`;
  }
}
```

For a more detailed breakdown on the differences between native classes and the
Ember object model, continue on through the guides.
