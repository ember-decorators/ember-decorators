# Quickstart

## Installation

The addon is split into `object` and `component` decorators:
* `@ember-decorators/component`
* `@ember-decorators/object`

You can run the following command to install both packages:

```sh
npm install @ember-decorators/component @ember-decorators/object -D
```

<aside>If you're coming from v6 and earlier, the meta package `ember-decorators` no longer transitively ships the individual packages for your apps. You must install them directly.</aside>

## Usage

Now that the main `ember-decorators` addon is installed, you can import any of
the decorators from its sub-addons. The core of Ember Decorators consists of
many smaller addons namespaced under the `@ember-decorators` scope on NPM,
including:

- `@ember-decorators/component`
- `@ember-decorators/object`

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
import { tagName, className } from '@ember-decorators/component';

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
