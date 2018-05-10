# Native Class Basics

If you aren't familiar with native class syntax, it's recommended that you read
up on them. The [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
is a good starting point, covering all the basics. This guide will highlight the
differences between `EmberObject` and `class` syntax.

This page covers the basics of class definition, constructors, and method
definition - all things that are supported by the `class` keyword as of ES2015.
Subsequent pages cover {{link-to 'class fields' 'docs.class-fields'}} and
{{link-to 'decorators' 'docs.decorators'}} in depth.

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
  **Note**: You can omit the class name from native classes, e.g. `class extends
  EmberObject`. While this is possible, it is **not** recommended. Giving your
  classes names will give them actual names in the JS vm, meaning that name will
  show in the console and developer tools instead of `(unknown mixin)` or the
  name that the container gives them. In the future, this will make debugging
  and analyzing your app easier.
</aside>

### Extending native classes with `.extend()`

As of Ember v3.2, you can extend interoperably back and forth between native
classes and `EmberObject` style extends:

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

Prior to v3.2, it was only possible to extend from EmberObject to native object,
meaning using native classes was a one way street.

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

## Constructor

In `EmberObject`, we use the `init` as the constructor of the object:

```js
const Foo = EmberObject.extend({
  init() {
    this._super(...arguments);

    // do things
  }
});
```

With native classes, we replace this with the `constructor` function:

```js
class Foo extends EmberObject {
  constructor() {
    super(...arguments);

    // do things
  }
}
```

Note the usage of the `super` keyword instead of calling `this._super()`.
Another difference here is that you _must_ call `super` before interacting with
`this` in native classes, attempting to do so is a hard error:

```js
const Foo = EmberObject.extend({
  init() {
    this.foo = 'bar'; // technically allowed, but bad practice
    this._super(...arguments);
  }
});

class Foo extends EmberObject {
  constructor() {
    this.foo = 'bar'; // this will hard error
    super(...arguments);
  }
}
```

The `init` lifecycle hook is not removed and actually will continue to be called
as it was before. It is recommended that you do **not** use the `init` hook,
because it was effectively meant to be the constructor and will likely not exist
in the future.

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

Native getters and setters are recomputed every time they are run, which makes
them less useful than computed properties for many things. `@computed` was made
to wrap native getters and setters, meaning that any accessor can be converted
into a computed property by decorating it. This is discussed more in the
section on {{link-to 'decorators' 'docs.decorators'}}.

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
