## @motivation

<aside>Looking for the quickstart? {{docs-link 'Click here' 'docs.index'}}.</aside>

Decorators recently became a first class part of Ember.js API! They've been
accepted in [RFC](https://github.com/emberjs/rfcs/blob/master/text/0408-decorators.md),
and will be released in an upcoming version soon. A polyfill has been [created
as well](https://github.com/pzuraq/ember-decorators-polyfill).

Ember Decorators used to provide decorators like `@computed` and `@service`, but
now that Ember has first class support for these, it no longer does. However,
there are still some helpful decorators in this library that were not upstreamed
to Ember, and remain available for folks to use! These decorators are mainly for
compatibility with older Ember classes and features, specifically classic
components, observers, and event listeners.
