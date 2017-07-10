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

module.exports = {
  name: 'ember-decorators',

  _getParentOptions: function() {
    let options;

    if (this.parent) {
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
      let TransformClassProperties = requireTransform('babel-plugin-transform-class-properties');
      let TransformDecoratorsLegacy = requireTransform('babel-plugin-transform-decorators-legacy');

      let checker = new VersionChecker(this.parent).for('ember-cli-babel', 'npm');

      if (checker.satisfies('^6.0.0-beta.1')) {
        parentOptions.babel = parentOptions.babel || {};
        parentOptions.babel.plugins = parentOptions.babel.plugins || [];

        if (parentOptions.babel.plugins.indexOf('transform-decorators-legacy') === -1) {
          parentOptions.babel.plugins.push(TransformDecoratorsLegacy);
        }

        if (parentOptions.babel.plugins.indexOf('transform-class-properties') === -1) {
          parentOptions.babel.plugins.push(TransformClassProperties);
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
