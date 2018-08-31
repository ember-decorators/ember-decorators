'use strict';

module.exports = {
  name: '@ember-decorators/object',

  included() {
    this._super.apply(this, arguments);

    let host = this._findHost();

    this.options = this.options || {};
    this.options.babel = this.options.babel || {};
    this.options.babel.plugins = this.options.babel.plugins || [];

    this.setupBabelPlugins(
      this.options.babel.plugins,
      host.options ? host.options['@ember-decorators'] : null
    );
  },

  setupBabelPlugins(plugins, options) {
    let shouldThrowOnComputedOverride =
      options && 'throwOnComputedOverride' in options
        ? options.throwOnComputedOverride
        : true;

    let pluginOptions = {
      envFlags: {
        source: 'ember-decorators-flags',
        flags: {
          DEBUG: false,
        },
      },

      features: {
        name: 'ember-decorators-flags',
        source: 'ember-decorators-flags',
        flags: {
          THROW_ON_COMPUTED_OVERRIDE: shouldThrowOnComputedOverride,
        },
      },

      externalizeHelpers: {
        global: 'Ember',
      },

      debugTools: {
        source: 'ember-decorators-flags',
        assertPredicateIndex: 1,
      },
    };

    plugins.push([require.resolve('babel-plugin-debug-macros'), pluginOptions]);
  },
};
