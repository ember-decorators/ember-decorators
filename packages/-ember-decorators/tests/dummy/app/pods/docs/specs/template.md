# Specs

Ember Decorators follows the [current decorators "stage 2" proposal specs](https://github.com/tc39/proposal-decorators).
The [`@ember-decorators/utils`](https://github.com/ember-decorators/ember-decorators/tree/master/packages/utils)
package normalizes the preceding [legacy decorators "stage 1" proposal API](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#why-legacy)
to the current one, so that you don't have to worry about it.

These two documents from the spec repo are especially helpful:

- [`METAPROGRAMMING.md`](https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md):
  how to write and use decorators
- [`TABLE.md`](https://github.com/tc39/proposal-decorators/blob/master/TABLE.md):
  detailed API docs for the decorator input parameter and output return value

[`@ember-decorators/babel-transforms`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/)
is responsible for transforming decorators and class properties in your code to
JavaScript that can run in today's browsers. For this we use these plugins:

- [`@babel/plugin-proposal-decorators`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
- [`@babel/plugin-proposal-class-properties`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)

Check the
[`package.json`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/package.json)
to see what version of the transforms we are currently using. For information on
the spec compliancy of the transforms, see the Babel issue tracker:

- [Spec: "Decorators"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Decorators%22)
- [Spec: "Class Fields"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Class+Fields%22)
