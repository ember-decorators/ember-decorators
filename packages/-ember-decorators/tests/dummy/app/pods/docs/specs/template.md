# Specs

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

## Current State

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

## Soon

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

## Some Time after Soon

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
