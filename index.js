/* eslint-env node */
'use strict';

const path = require('path');
const VersionChecker = require('ember-cli-version-checker');

function requireTransform(transformName) {
  let plugin = require(transformName);

  plugin = plugin.__esModule ? plugin.default : plugin;

  // adding `baseDir` ensures that broccoli-babel-transpiler does not
  // issue a warning and opt out of caching
  let pluginPath = require.resolve(`${transformName}/package`);
  let pluginBaseDir = path.dirname(pluginPath);
  plugin.baseDir = () => pluginBaseDir;

  return plugin;
}

function hasPlugin(plugins, name) {
  for (let maybePlugin of plugins) {
    let plugin = Array.isArray(maybePlugin) ? maybePlugin[0] : maybePlugin;
    let pluginName = typeof plugin === 'string' ? plugin : plugin.name;

    if (pluginName === name) {
      return true;
    }
  }

  return false;
}

module.exports = {
  name: 'ember-decorators',

  _getParentOptions: function() {
    let options;

    // The parent can either be an Addon or a Project. If it's an addon,
    // we want to use the app instead. This public method probably wasn't meant
    // for this, but it's named well enough that we can use it for this purpose.
    if (this.parent && !this.parent.isEmberCLIProject) {
      options = this.parent.options = this.parent.options || {};
    } else {
      options = this.app.options = this.app.options || {};
    }

    return options;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    let parentOptions = this._getParentOptions();

    let disableTransforms = parentOptions.emberDecorators && parentOptions.emberDecorators.disableTransforms;

    if (!this._registeredWithBabel && !disableTransforms) {
      let checker = new VersionChecker(this.parent).for('ember-cli-babel', 'npm');

      if (checker.satisfies('^6.0.0-beta.1')) {
        let TransformDecoratorsLegacy = requireTransform('babel-plugin-transform-decorators-legacy');
        let TransformClassProperties = requireTransform('babel-plugin-transform-class-properties');

        // Create babel options if they do not exist
        parentOptions.babel = parentOptions.babel || {};

        // Create and pull off babel plugins
        let plugins = parentOptions.babel.plugins = parentOptions.babel.plugins || [];

        if (!hasPlugin(plugins, 'transform-decorators-legacy')) {
          // unshift the transform because it always must come before class properties
          plugins.unshift(TransformDecoratorsLegacy);
        }

        if (!hasPlugin('transform-class-properties')) {
          plugins.push(TransformClassProperties);
        }

        if (!('@ember-decorators/babel-transforms' in this.parent.addonPackages)) {
          app.project.ui.writeWarnLine(
            'ember-decorators: You have not installed @ember-decorators/babel-transforms. ' +
            '@ember-decorators/babel-transforms has been extracted to a separate addon.  See instructions for installation.'
          );
        }
      } else {
        app.project.ui.writeWarnLine(
          'ember-decorators: You are using an unsupported ember-cli-babel version,' +
          'decorator/class-property transforms will not be included automatically'
        );
      }

      this._registeredWithBabel = true;
    }
  }
};
