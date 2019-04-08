# Stability & Support

Ember Decorators is being used in production apps today, and the library is
fully tested in both Javascript and Typescript. We aim to maintain a stable API
as decorators and class fields evolve through the TC39 process. This means that
we will not make major breaking changes to our APIs _unless_ absolutely required
by changes in the underlying spec.

Class fields are currently stage 3 in the process and decorators are currently
stage 2. Stage 4 marks completion, stage 3 marks a high level of confidence in
stability, and stage 2 marks belief that the spec will eventually be included in
the language in some form. Recently decorators began undergoing a redesign while
still remaining in stage 2. Ember is following their recommendations through
this process, and supporting the "legacy" stage 1 decorator specification.

## Browser Support

Ember Decorators supports the same browser versions that Ember 3 does, IE11+ and
the last two versions of every major browser.

## Ember Support

Ember Decorators currently actively supports Ember versions which support native
classes. The first version that officially ships native classes is 3.6, and
there is a [polyfill which works on 3.4 and 3.5](https://github.com/pzuraq/ember-native-class-polyfill).
Prior versions of Ember will still work with decorators, but it is _not_
recommended that you attempt to adopt them, since there have been major changes
to the way classes work since native classes shipped. Support for earlier
versions of Ember may be added at some point in the future, please open an issue
on the polyfill repository if you would like support added for a particular
version.

## Typescript Support

As of `ember-cli-typescript@2.0`, Typescript in Ember is now being compiled
using Babel, which allows you to use the same stage 2 transforms in Typescript
as you would in a normal Javascript app. Installing the latest version of
`ember-cli-babel` should work as expected, and all decorators should operate the
same.
