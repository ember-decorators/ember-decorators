# Notable Differences

Ember Decorators strives to be a model for using decorators in Ember, and as
such we try to match the Ember APIs 1-for-1 as much as possible. However, there
are times when we have had to make changes due to the design constraints of
decorators.

## `@reads` and `@overridableReads`

In Ember, there are several different computed property macros which can be used
to alias an existing property:

* `Ember.computed.alias`: Provides a bi-directional alias (both `get` and `set`)
* `Ember.computed.readOnly`: Provides a one-way, read-only alias. Getting the
computed will retrieve the value of the aliased property, but setting it will
throw an error.
* `Ember.computed.oneWay`: Provides a one-way, overridable alias. Getting the
computed will retrieve the value of the aliased property, but setting it will
_override_ the alias and set it to the new value. When this is done, the alias
is destroyed entirely, and all subsequent changes must be made by setting the
computed.
* `Ember.computed.reads`: The same as `oneWay`.

There is also a modifier for computed properties, `readOnly()`, which can be
used to mark a computed as read-only:

```js
prop: computed('anotherProp', function() {}).readOnly(),
aliased: alias('anotherProp').readOnly(),
```

Because this modifier was chained onto the definition of a computed, the
difference between the modifier and the macro was always clear. In the world of
decorators, however, modifiers like `readOnly` are much more naturally
implemented as their own decorator:

```js
@computed('anotherProp') @readOnly prop() {}
@alias('anotherProp') @readOnly aliased;
```

This is problematic, because it would force users to constantly rename either
the modifier or the macro whenever both were imported in the same file. So, we
made the decision to rename the macro. Unfortunately, the strongest choice for
the rename was `@reads`, which was already taken.

With that in mind, we considered the following points:

1. There are no other good names for a one-way, read-only alias.
2. `@readOnly` is usually the behavior developers want. The overridable nature
of `reads/oneWay` is actually extra behavior that they should opt into, not
opt out of.
3. If confusion were to arise and developers were to use `@reads` thinking it
was the same as `Ember.computed.reads`, they would be opting-in to a strictly
safer alias. This means there is no chance of introducing unintended behavior to
code, only minor headaches as developers retrain their muscle-memory to use the
new decorators.
4. Neither `@reads` nor `@oneWay` describe the overridable nature of the alias
in a semantically meaningful way.

And came to the conclusion that `@readOnly` should be renamed to `@reads`, and
`@reads/@oneWay` should be renamed to something more meaningful -
`@overridableReads`.

This difference can be confusing at first, but shouldn't be too problematic in
the long run. For transitioning old code, we are at work on a codemod which will
take the renames into account.
