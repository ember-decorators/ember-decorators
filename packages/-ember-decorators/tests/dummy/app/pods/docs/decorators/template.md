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
Some of them work very much the same as their equivalents in the standard Ember
world, and some have fairly large differences. This page will cover the general
decorators in some depth, and for more details you can refer to the API
documentation.

## Computed Properties

Computed properties are the most different in behavior from standard Ember
computeds. The differences come from the decision to bring CPs inline with
native Javascript getter/setter syntax:

```js
const Foo = EmberObject.extend({
  bar: computed('baz', {
    get() {
      return this._bar;
    },

    set(key, value) {
      return this._bar = value;
    }
  })
});

// becomes
import { computed } from '@ember-decorators/object';

class Foo extends EmberObject {
  @computed('baz')
  get bar() {
    return this._bar;
  }

  set bar(value) {
    this._bar = value;
  }
}
```

There are three major differences between the standard computed and the
decorated version:

1. **Setter signature**

  The setter in standard computed properties receives both the `key` and the
  `value` as parameters, but this is illegal in native setter syntax - setters
  must receive exactly one param, the value to set.

2. **Setter return value**

  Native setters do not need to return a value at all, and do nothing with the
  return value if it exists. By default, the `@computed` decorator automatically
  calls the get function in the setter to match this behavior. You _may_
  optionally return a value and `@computed` will cache this value as it did
  before, which may be useful for expensive computed properties.

3. **Setting properties without a setter**

  When you attempt to set a property on a class that has a native getter but no
  native setter, it will hard error. Standard computed properties, on the other
  hand, would allow you to "clobber" them by completely overwriting them. When
  this happened, the computed property would effectively be removed from the
  class, never updating or calling its get function again:

  ```js
  const Foo = EmberObject.extend({
    bar: computed('baz', {
      get() {
        return this.baz;
      }
    })
  });

  let foo = Foo.create({ baz: 'baz' });

  console.log(foo.bar); // 'baz';

  foo.set('bar', 123);
  foo.set('baz', 456);

  console.log(foo.bar); // 123
  ```

  This behavior was bug prone and not inline with native setters, and it is
  guarded against when using the `@computed` decorator.

Aside from these differences, computed properties work the same as before. You
_must_ still use `set` to update their values or invalidate their caches when
setting a dependent key. If you are on Ember > 3.1, you'll be able to rely on
native getters to get their values, otherwise you will have use `get`.

The standard Ember computed property macros have been recreated as decorators
as well. Specifics on their usage can be found in the API docs.

## Actions

The `@action` decorator can be used on any class method to turn it into an
action:

```js
const FooComponent = Component.extend({
  actions: {
    handleClick() {
      // ...
    }
  }
});

// becomes
import { action } from '@ember-decorators/object';

class FooComponent extends Component {
  @action
  handleClick() {
    // ...
  }
}
```

It's important to note that the method does _not_ get moved to the `actions`
hash of the object. This means that action names can conflict with existing
hooks such as `click` or `didRender`, and can conflict with arguments that are
passed into a class:

```js
class FooComponent extends Component {
  @action
  didRender() {} // This will collide with the didRender lifecycle hook

  @action
  click() {} // This will collide with the standard click handler

  @argument onClick;

  @action
  onClick() {} // This will collide with the onClick argument
}
```

## Observers and Events

Observers and events are not yet supported by Ember Decorators. We have plans to
add support shortly, in v2.1.

## Injections

Services and controllers can be injected via the `@service` and `@controller`
decorators:

```js
const FooComponent = FooComponent.extend({
  bar: service()
});

const FooController = FooController.extend({
  bar: controller()
});

// becomes

import { service } from '@ember-decorators/service';
import { controller } from '@ember-decorators/controller';

class FooComponent extends Component {
  @service bar;
}

class FooController extends Controller {
  @controller bar;
}
```

You can also pass the name of the service or controller as the first parameter
to the decorators:

```js
class FooComponent extends Component {
  @service('bar') barService;
}

class FooController extends Controller {
  @controller('bar') barController;
}
```

The decorators will attempt to inject based on the field name if no name is
provided.

## Component Decorators

Ember components have several special properties which can be used to customize
the component's element:

* `tagName`
* `classNames`
* `classNameBindings`
* `attributeBindings`

While these will eventually be removed from the framework, they are still
necessary today. `tagName` cannot be set directly on the instance of the class,
and the others can be but won't work properly because the are _concatenated_
properties - they get merged with the value of their parent class:

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
const ListComponent = Component.extend({
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

`@tagName` and `@classNames` are class decorators because they directly
customize the component element. `@className` and `@attribute` allow you to
decorate properties directly, instead of having declare the bindings in a
separate place.

## Data Decorators

Decorators exist for `DS.attr`, `DS.hasMany`, and `DS.belongsTo`:

```js
const User = Model.extend({
  name: attr(),
  email: attr('string', { default: 'example@gmail.com' }),

  avatar: belongsTo('image', { async: false }),

  posts: hasMany
});

// becomes

class User extends Model {
  @attr name;

  @attr('string', { defaultValue: 'example@gmail.com' })
  email;

  @belongsTo('image', { async: false })
  avatar;

  @hasMany posts;
}
```

They should work the same as their non-decorator counterparts in general.
Types and options can be passed into the decorator directly, or they can rely
on reflection of the field name they are decorating.
