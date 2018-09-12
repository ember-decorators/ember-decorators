# Configuration

Ember Decorators can be configured to provide stricter behavior at build time.
Currently the only configuration is for throwing hard assertions when a computed
property is overridden. This can be done by passing the
`shouldThrowOnComputedOverride` option to your host app's configuration:

```js
// ember-cli-build.js
var app = new EmberApp(defaults, {
  '@ember-decorators': {
    throwOnComputedOverride: false
  }
});
```

Note that this config option is _global_, so configuring it at the addon level
is unecessary.
