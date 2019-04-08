# Decorators

Decorators are a fundamentally new concept in Javascript, but exist in other
languages such as Python or Java (as Annotations). The idea is that they
transform a value in a declarative and transparent way, allowing you to write
more readable and minimal code:

```js
class Foo {
  @readonly foo = 'bar';
  @nonenumerable baz = 'qux';

  @deprecate
  myMethod() {
    // ...
  }
}
```

Ember was written long before decorators were available, but functions like
`computed()` and `observer()` are actually not much different from decorators:
they receive a few keys and a function, and then return a function (or
function-like object) that now watches those keys and updates or invalidates
when they change. Decorators can do pretty much the same thing, but with a nicer
syntax.

The decorators included in the this library should enable you to write native
classes with the same functionality and terseness as the Ember object-model.
Most of them work almost exactly the same as their equivalents in the standard
Ember world, and they are even _fully compatible_ with classic class syntax,
allowing you to use them as drop-in replacements. This page will cover the
general decorators in some depth, and for more details you can refer to the API
documentation.

If you are interested in _how_ decorators work under the hood, head over to the
{{link-to 'specs page' 'docs.specs'}}.

Ember now provides first class decorators for:

* Computed Properties and Macros (Including Ember Data)
* Actions
* Injections

For details on their usage, you should visit the official Ember guides. We'll 
cover the decorators that Ember Decorators continues to provide.

## Component Decorators

Ember components have several special properties which can be used to customize
the component's element and template:

* `layout`
* `tagName`
* `classNames`
* `classNameBindings`
* `attributeBindings`

While these will eventually be removed from the framework, they are still
necessary today. `tagName` and `layout` cannot be set directly on the instance
of the class, and the others can be but won't work properly because the are
_concatenated_ properties - they get merged with the value of their parent
class:

```js
const FooComponent = Component.extend({
  classNames: ['foo']
});

const BarComponent = Component.extend({
  classNames: ['bar']
});

console.log(BarComponent.prototype.classNames); // ['foo', 'bar']
```

Instead, you can replace these with decorators:

```js
import layout from './template';

const ListComponent = Component.extend({
  layout,
  tagName: 'ul',
  classNames: ['list-reset'],
  classNameBindings: ['collapsed', 'isEmpty:hidden'],
  attributeBindings: ['ariaRole', 'isTesting:data-test-list']

  collapsed: false,
  isEmpty: false,
  ariaRole: 'list',
  isTesting: false
})

// becomes
import template from './template';

@layout(template)
@tagName('ul')
@classNames('list-reset')
class ListComponent extends Component {
  @className
  collapsed = false;

  @className('hidden')
  isEmpty = false;

  @attribute
  ariaRole = 'list';

  @attribute('data-test-list')
  isTesting = false;
}
```

`@layout`, `@tagName`, and `@classNames` are class decorators because they
directly customize the component element. `@className` and `@attribute` allow
you to decorate properties directly, instead of having declare the bindings in a
separate place.

## Observers and Events

Observers and events listeners can be added with the `@observes` and `@on`
decorators:

```js
const FooComponent = Component.extend({
  bar: observer('baz', function() {}),
  initialize: on('init', function() {})
});

// becomes

import { observes, on } from '@ember-decorators/object';

class FooComponent extends Component {
  @observes('baz')
  bar() {}

  @on('init')
  initialize() {}
}
```

One major difference here comes from _extending_ classes which have observers
and event listeners. Previously, if you overrode a property that was an observer
on the superclass, it would be removed from the subclass. With native classes
and decorators you must manually remove these with `@unobserves` and `@off`
respectively:

```js
const FooComponent = Component.extend({
  bar: observer('baz', function() {}),
  initialize: on('init', function() {})
});

const BarComponent = FooComponent.extend({
  bar: null,
  initialize: null
});

// becomes

import { observes, unobserves, on, off } from '@ember-decorators/object';

class FooComponent extends Component {
  @observes('baz')
  bar() {}

  @on('init')
  initialize() {}
}

class BarComponent extends FooComponent {
  @unobserves('baz') bar;

  @off('init') initialize;
}
```