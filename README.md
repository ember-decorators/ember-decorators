# Ember Decorators

[![npm version](https://badge.fury.io/js/ember-decorators.svg)](https://badge.fury.io/js/ember-decorators)
[![Build Status](https://travis-ci.org/ember-decorators/ember-decorators.svg?branch=master)](https://travis-ci.org/ember-decorators/ember-decorators)

Ember Decorators is a project dedicated to exploring and unlocking the future
of native classes in Ember.js. Its goal is to provide a set of decorators which
can be used to write native classes with every standard feature that is
available in Ember, along with the transforms and build system required to
polyfill and ship them in your app today!

The [documentation website](https://ember-decorators.github.io/ember-decorators)
for Ember Decorators contains a detailed guide on using native classes with
Ember today, along with detailed API documentation for all the decorators
included in this library.

## Usage

First install the main `ember-decorators` addon.

```sh
ember install ember-decorators
```

This addon doesn't contain any decorators itself, but includes the core set of
subaddons that are necessary to begin writing Ember using native classes:

- `@ember-decorators/component`
- `@ember-decorators/controller`
- `@ember-decorators/data`
- `@ember-decorators/object`
- `@ember-decorators/service`

### Usage in Applications

In your application where you would normally have:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  foo: Ember.inject.service(),

  bar: Ember.computed('someKey', 'otherKey', function() {
    var someKey = this.get('someKey');
    var otherKey = this.get('otherKey');

    return `${someKey} - ${otherKey}`;
  }),

  actions: {
    handleClick() {
      // do stuff
    },
  },
});
```

You replace it with this:

```js
import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';

export default class ExampleComponent extends Component {
  @service foo;

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

See the [API Documentation](https://ember-decorators.github.io/ember-decorators)
for detailed examples and documentation of the individual decorators.

## Development

### Specs

As of now the latest version of Ember Decorators still follows the
[current decorators "stage 2" proposal specs][proposal-stage-2].
However, this "stage 2" proposal _will not_ progress to stage 3.

There is a new, radically different proposal called
["static decorators"][proposal-static-decorators] that will replace the "stage
2" proposal. In accordance wit the
[Ember "Decorator Support" RFC][rfc-decorator-support] Ember Decorators will
soon be upgraded to implement the old legacy decorators "stage 1" proposal
proposal again. This follows the official TC39 recommendation, which is:

> Unfortunately, we're in the classic trap of, "The old thing is deprecated, and
> the new thing is not ready yet!" For now, best to keep using the old thing.

> The decorators champion group would recommend continuing to use Babel "legacy"
> decorators or TypeScript "experimental" decorators. [...] We recommend that
> [...] tools maintain support for [...] legacy decorators, until it's possible
> to transition to the decorators of this _[static decorators]_ proposal.

> Babel 7 supports the _["stage 2"]_ decorators proposal presented to TC39 in
> the November 2018 TC39 meeting. It's fine to use these for experimental
> purposes, but they face significant performance issues, are not yet widely
> adopted; we don't plan to continue pushing for this proposal in TC39. As such,
> we recommend against using this version for serious work. In follow-on
> proposals to add more built-in decorators, we hope to be able to recover the
> extra functionality that the November 2018 decorators proposal supported.

— _[How should I use decorators in transpilers today?][tc39-recommendation]_

[proposal-stage-2]: https://github.com/tc39/proposal-decorators
[proposal-static-decorators]: https://github.com/tc39/proposal-decorators/pull/250
[rfc-decorator-support]: https://github.com/emberjs/rfcs/blob/3cd45c8b6f037bc29dcd104f8b996c27db66d568/text/0000-decorator-support.md
[tc39-recommendation]: https://github.com/tc39/proposal-decorators/tree/static#how-should-i-use-decorators-in-transpilers-today

#### Current State

As of now the [`@ember-decorators/utils`](https://github.com/ember-decorators/ember-decorators/tree/master/packages/utils)
package normalizes the preceding [legacy decorators "stage 1" proposal API](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#why-legacy)
to the current "stage 2" one.

These two documents from the "stage 2"- spec repo are especially helpful:

- [`METAPROGRAMMING.md`](https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md):
  how to write and use decorators
- [`TABLE.md`](https://github.com/tc39/proposal-decorators/blob/master/TABLE.md):
  detailed API docs for the decorator input parameter and output return value

[`@ember-decorators/babel-transforms`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/)
is responsible for transforming decorators and class properties in your code to
JavaScript that can run in today's browsers. For this we use these plugins:

- [`@babel/plugin-proposal-decorators`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
- [`@babel/plugin-proposal-class-properties`](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)

Check the [`package.json`](https://github.com/ember-decorators/ember-decorators/blob/master/packages/babel-transforms/package.json)
to see what version of the transforms we are currently using. For information on
the spec compliancy of the transforms, see the Babel issue tracker:

- [Spec: "Decorators"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Decorators%22)
- [Spec: "Class Fields"](https://github.com/babel/babel/pulls?utf8=%E2%9C%93&q=label%3A%22Spec%3A+Class+Fields%22)

#### Soon

The Ember 3.10 canary has a `EMBER_NATIVE_DECORATOR_SUPPORT` feature flag. This
flag makes the built-in Ember core computed property macros, injections, and
`computed` usable in two functionally equivalent ways:

- The old classic Ember Object Model:

  ```ts
  import EmberObject, { computed } from '@ember/object';

  const Person = EmberObject.extend({
    fullName: computed('firstName', 'lastName', {
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    }),
  });
  ```

- As decorators in the new native class syntax:

  ```ts
  import EmberObject, { computed } from '@ember/object';

  class Person {
    @computed('firstName', 'lastName')
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
  ```

However, in accordance with the ["Decorator Support" RFC][rfc-decorator-support]
`EMBER_NATIVE_DECORATOR_SUPPORT` assumes the legacy "stage 1" decorators
proposal. This means that you can't use the current `v5.x.x` series of Ember
Decorators with `EMBER_NATIVE_DECORATOR_SUPPORT` enabled.

We will soon (some time after [EmberConf][emberconf]) release a new version of
Ember Decorators that reverts back to the legacy "stage 1" proposal.
We'll give our best to expose a solid public API in `@ember-decorators/utils`
that will hopefully allow early adopters of Ember Decorators to adapt their
"stage 2" style decorators back to "stage 1" and maybe vice versa.

[emberconf]: https://emberconf.com/

#### Some Time after Soon

The decorators proposal champions at TC39 and we are still very confident that
decorators definitely will become a standardized part of the JavaScript
language. Decorators (mostly "stage 1") are already widely used in the whole JS
ecosystem, not only in Ember.

The motivation for the first redesign from "stage 1" to "stage 2" was that
legacy decorators were not powerful enough and lacked some crucial abilities.
The reasons for the second redesign from "stage 2" to the new
["static decorators" proposal][proposal-static-decorators] are performance
problems and implementation difficulties for vendors:

> It took us a long time for everyone to get on the same page about the
> requirements spanning frameworks, tooling and native implementations. Only
> after pushing hard towards the previous _["stage 2"]_ direction did we get
> real-world experience that it was slow in transpilers and a detailed
> explanation of how they would be slow in native implementations.

— _[Why is decorators taking so long?][why-is-decorators-taking-so-long]_

[why-is-decorators-taking-so-long]: https://github.com/tc39/proposal-decorators/tree/static#why-is-decorators-taking-so-long

The new ["static decorators" proposal][proposal-static-decorators] was built
with input from vendors, like Google's V8 team, from the get-go and makes
decorators a largely statically analyzable first-class citizen of the language.

Ember will keep using the legacy "stage 1" decorators proposal, until the new
"static decorators" proposal hits stage 3, which means that no more changes to
the spec are expected. To keep further API churn as minimal as possible, the
Ember ecosystem will only then transition to the new spec. You can read more on
this in the ["Decorator Support" RFC][rfc-decorator-support].

### Organization

This repository consists of multiple packages managed with [lerna.js](https://lernajs.io/).
The decorators all reside in their own individual packages under `/packages`,
along with the main `ember-decorators` package.

The main package serves three purposes:

1. A quick way to install all of the subpackages and get new projects up and
   running. Installing the main package also adds any necessary babel transforms,
   and sets up ESLint properly.
2. A place for common functionality, such as the native class blueprints that
   overwrite the default Ember blueprints.
3. A place for the documentation site and tests for all of the other addons.
   Tests were consolidated from the other addons in order to speed up the testing
   and development process.

### Setting up

- Fork the repository
- `git clone <your-fork-url>`
- `cd ember-decorators`
- `npm install`

### Linting

- `npm run lint:js`
- `npm run lint:js -- --fix`

### Running tests

- `npm test` – Runs the test suite on the current Ember version

### Running the dummy application

- `npm start`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

## License

This project is licensed under the [MIT License](LICENSE.md).
