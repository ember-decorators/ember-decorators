# Native Class Basics

If you aren't familiar with native class syntax, it's recommended that you read
up on them. The [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
is a good starting point, covering all the basics. This guide will highlight the
differences between `EmberObject` and `class` syntax.

This page covers the basics of class definition, constructors, and method
definition - all things that are supported by the `class` keyword as of ES2015.
Subsequent pages cover {{link-to 'class fields' 'docs.class-fields'}} and
{{link-to 'decorators' 'docs.decorators'}} in depth. If you are interested in
_how_ decorators work under the hood, head over to the
{{link-to 'Specs page' 'docs.specs'}}.

## Definition

When defining classes with `EmberObject`, we call what is effectively a `static`
class method, `.extend()`, and pass in an object with properties and methods:

```js
const Foo = EmberObject.extend({
  // ...
})
```

When using native syntax, we instead use the `class`/`extends` keyword pair:

```js
class Foo extends EmberObject {
  // ...
}
```

That's the only difference. Under the hood, both native classes and EmberObject
rely on standard prototypical inheritance, making them interoperable.

<aside>
  <strong>Note</strong>: You can omit the class name from native classes, e.g.
  <code>class extends EmberObject</code>. While this is possible, it is
  <strong>not</strong> recommended. Giving your classes names will give them
  actual names in the JS vm, meaning that name will show in the console and
  developer tools instead of <code>(unknown mixin)</code> or the name that the
  container gives them. In the future, this will make debugging and analyzing
  your app easier.
</aside>

### Extending native classes with `.extend()`

In versions of Ember that support native classes, you can extend interoperably
back and forth between native classes and `EmberObject` style extends:

```js
class Foo extends EmberObject {
  // ...
}

const Bar = Foo.extend({
  // ...
});

class Baz extends Bar {
  // ...
}
```

## Creation

When creating classes that extend from `EmberObject`, you should continue to use
the factory methods (e.g. `.create()`):

```js
class Foo extends EmberObject {

}

let foo = new Foo(); // bad
let foo = Foo.create(); // good
```

This still works because `.create()` is a <a href="#static-methods">static
method</a>, which is discussed in more detail below. `EmberObject` still does
some vital things under the hood during class creation, and creating objects
with `new` is not considered public API.

When creating classes that do _not_ extend from `EmberObject`, you should use
`new` as you would normally.

## Constructor vs `init`

In `EmberObject`, we use the `init` as the constructor of the object:

```js
const Foo = EmberObject.extend({
  init() {
    this._super(...arguments);

    // do things
  }
});
```

With native classes, we also have the option to use the constructor:

```js
class Foo extends EmberObject {
  constructor() {
    super(...arguments);

    // do things
  }
}
```

While this is possible, certain values such as service injections and create
parameters will _not_ be available during the `constructor` phase of class
creation. It is therefore recommended that you continue to use
`init` for the time being as you transition to native classes that extend from
`EmberObject`:

```js
class Foo extends EmberObject {
  init() {
    super.init(...arguments);

    // do things
  }
}
```

Native classes which do _not_ extend from `EmberObject` do not have an `init`
hook, and should use `constructor` instead:

```js
class Foo extends Object {
  constructor() {
    super(...arguments);

    // do things
  }
}
```


## Methods

Methods are defined and used in almost exactly the same way as before:

```js
const Foo = EmberObject.extend({
  doSomething() {
    // ...
  },

  doSomethingTwice() {
    this.doSomething();
    this.doSomething();
  }
});

class Foo extends EmberObject {
  doSomething() {
    // ...
  }

  doSomethingTwice() {
    this.doSomething();
    this.doSomething();
  }
}
```

Note that you do not need to put a trailing comma after methods.

### Using `super`

When calling `super`, you must also name the method you want to call on the
superclass:

```js
const Foo = EmberObject.extend({
  doSomething() {
    this._super();
  }
});

class Foo extends EmberObject {
  doSomething() {
    super.doSomething();
  }
}
```

If the method was not defined on the superclass, this will throw an error.

### Static Methods

Static methods (or properties) refer to methods placed directly on the class
constructor, rather than the instance of the class. For instance, `.extend` and
`.create` are static methods:

```js
let obj = EmberObject.create(); // Invoked on the class definition
obj.create(); // `create` is undefined, doesn't exist on the instance
```

With `EmberObject`, in order to add static methods or properties to a class you
had to use the `reopenClass` static method:

```js
const Foo = EmberObject.extend({
  // ...
});

Foo.reopenClass({
  bar() {
    console.log('static method bar called');
  }
});

Foo.bar(); // 'static method bar called'
```

With native classes, this can be done directly in the main class definition
using the `static` keyword:

```js
class Foo extends EmberObject {
  static bar() {
    console.log('static method bar called');
  }

  // ...
}

Foo.bar(); // 'static method bar called'
```

### Accessors

You can use native accessor methods (getters and setters) on classes as well:

```js
class Foo extends EmberObject {
  get foo() {
    return this._foo;
  }

  set foo(value) {
    this._foo = value;
  }
}
```

Native getters and setters are recomputed every time they are run, and have no
way of sending property change notifications, which makes them less useful than
computed properties for many things. `@computed` was made to wrap native getters
and setters, meaning that any accessor can be converted into a computed property
by decorating it. This is discussed more in the section on
{{link-to 'decorators' 'docs.decorators'}}.

### Lifecycle Hooks

Lifecycle hooks are plain old methods, and the same differences in method usage
apply to them:

```js
const Foo = Component.extend({
  didRender() {
    this._super(...arguments);
  }
});

class Foo extends Component {
  didRender() {
    super.didRender(...arguments);
  }
}
```

### When To Extend EmberObject

In many existing Ember apps and addons, it is not uncommon for every single
class to extend from `EmberObject` and use the Ember Object Model. This is due
to the fact that many features such as computed properties, observers, etc. were
not usable with native classes in an ergonomic way, until now.

Now that native classes _are_ usable with these features, the vast majority of
classes outside of the standard Ember constructs such as Components, Routes, and
Controllers, should _not_ need to extend from `EmberObject`. Instead, you should
define your classes without extending from any base class:

```js
// before
const TreeNode = EmberObject.extend({
  children: null,

  init() {
    this._super(...arguments);

    this.children = this.children || [];
  }
});

let tree = Tree.createNode({ children: [TreeNode.create()] });

// after
class TreeNode {
  constructor(children = []) {
    this.children = children;
  }
}

let tree = new TreeNode([new TreeNode()]);

```

As a rule of thumb, in a modern Ember app written with only native class syntax:

1. You should never be extending `EmberObject` directly. Only the following
classes need to be extended, because they are framework classes:
  * `Component`
  * `Controller`
  * `Helper`
  * `Model`
  * `Route`
  * `Service`

2. You should never have to use `.create()`. Only framework objects need to
extend EmberObject, and the _container_ always creates those. So, any utility
classes you define and instantiate yourself will not extend from `EmberObject`,
and you can use `new` instead.
