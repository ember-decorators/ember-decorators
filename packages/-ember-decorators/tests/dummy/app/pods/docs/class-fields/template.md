# Class Fields

Class fields are one of the most different things in the new class model. They
are different than standard object properties, and for good reason - to solve
the "shared state" problem that plagues many prototypical class systems. Here's
a quick example of them, and the equivalent property usage in `EmberObject`:

```js
const Foo = Component.extend({
  prop: 123
});

class Foo extends Component {
  field = 123;
}
```

## Fields vs. Properties

Fields differ from properties in two major ways:

1. **Initialization**

   The right-hand side of a class field expression, known as the field's
   initializer, is run every single time an instance of the class is created.
   This means that every instance of the class will receive a new instance of
   whatever value the initializer returns. This was not the case with
   `EmberObject`, which would share state with other instances of the class - the
   shared state problem mentioned above:

   ```js
   const Foo = EmberObject.extend({
     bar: []
   });

   let foo1 = Foo.create();
   let foo2 = Foo.create();

   foo1.bar.push('baz');
   console.log(foo2.bar); // will be ['baz'], because foo1 and foo2
                          // share the same array

   class Foo extends EmberObject {
     bar = [];
   }

   let foo1 = Foo.create();
   let foo2 = Foo.create();

   foo1.bar.push('baz');
   console.log(foo2.bar); // will be [], because foo2 gets its own unique array
   ```

2. **Placement**

   Fields are placed directly on each instance of a class. In other words, this:

   ```js
   class Foo extends EmberObject {
     bar = 123;
   }
   ```

   Is the same as this:

   ```js
   class Foo extends EmberObject {
     constructor() {
       super(...arguments);

       this.bar = 123;
     }
   }
   ```

   In the Ember Object model, properties that are passed into `extend` are not
   placed on the instances themselves, but the class's prototype:

   ```js
   const Foo = EmberObject.extend({
     baz: 123
   });

   let foo = Foo.create();

   foo.hasOwnProperty('baz'); // false
   Object.getPrototypeOf(foo).hasOwnProperty('baz'); // true
   ```

Fields can be thought of as syntactic sugar for assigning values in the
constructor. Field initializers are run at the beginning of the class's
constructor if the class is a base class, *or* after the call to `super` if the
class is a subclass. For example, the following:

```js
class Foo {
  foo = 123;

  constructor() {
    console.log('foo');
  }
}

class Bar extends Foo {
  bar = 456;

  constructor() {
    console.log('before bar');
    super();
    console.log('bar');
  }
}
```

Is equivalent to this:

```js
class Foo {
  constructor() {
    this.foo = 123;
    console.log('foo');
  }
}

class Bar extends Foo {
  constructor() {
    console.log('before bar');
    super();
    this.bar = 456;
    console.log('bar');
  }
}
```

### Static Class Fields

Like static methods, static fields can also be assigned to the class itself.
This is especially useful for fields like `positionalParams` that had to be
assigned using `reopenClass` with `EmberObject`:

```js
// before
const FooComponent = Component.extend({});

FooComponent.reopenClass({
  positionalParams: ['bar', 'baz']
});

// after
class FooComponent extends Component {
  static positionalParams = ['bar', 'baz'];
}
```

Static class field initializers are only run once, since they are assigned to
the constructor and not the individual instances.

### Using Initializers Effectively

Using EmberObject, it was considered best practice to avoid shared state by
either wrapping object/array/class properties as computeds, or setting them in
the constructor:

```js
const Foo = EmberObject.extend({
  someArray: computed(function() {
    return [];
  }),

  init() {
    this.someObject = {};
    this.someClass = Bar.create({ baz: this.someObject });
  }
})
```

With native classes, these can now all become class fields:

```js
class Foo extends EmberObject {
  someArray = [];
  someObject = {};
  someClass = Bar.create({ baz: this.someObject });
}
```

Note that class initializers are run in the order they are defined, from
top to bottom, and can refer to the instance of the class via `this`. This is
how the initializer for `someClass` is able to refer to `this.someObject` to get
the initialized value (an empty object). This pattern should be used cautiously,
as it may not be immediately obvious what is happening to users who are
unfamiliar with class.

### Binding Functions with Class Fields

One anti-pattern that utilizes the behavior of initializers is binding functions
to the instance of the class using arrow functions. For instance, this:

```js
const FooComponent = Component.extend({
  didInsertElement() {
    this.handleBodyClick = () => {
      // do something
    };

    document.body.addEventListener('click', this.handleBodyClick);
  },

  willDestroyElement() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }
});
```

Can instead be accomplished like this:

```js
class FooComponent extends Component {
  handleBodyClick = () => {
    // do something
  };

  didInsertElement() {
    document.body.addEventListener('click', this.handleBodyClick);
  }

  willDestroyElement() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }
}
```

While this works, there are a [number of
reasons](https://github.com/tc39/proposal-decorators/blob/master/bound-decorator-rationale.md)
for why it is not a great idea in practice, including:

1. It breaks inheritance and `super`, since class fields overwrite each other as
   the class is constructed
2. `arguments` does not behave the same as a normal method
3. It's difficult to mock in tests, since you can't change the function on the
   prototype of the class.

Instead, you should use the `@action` decorator, which binds methods to the
instance automatically:

```js
class FooComponent extends Component {
  @action
  handleBodyClick() {
    // do something
  }

  didInsertElement() {
    document.body.addEventListener('click', this.handleBodyClick);
  }

  willDestroyElement() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }
}
```

## Initializers vs Create Properties

Until recently, class field initializers would run _after_ create parameters
were assigned to the class. This meant that it was impossible to override the
"default" values assigned in the class definition. This has since changed, and
class fields will now always be assigned _before_ create parameters, working as
expected.
