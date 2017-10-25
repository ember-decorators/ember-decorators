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

  init(parent, project) {
    this._super.init.apply(this, arguments);

    // Checker works with the actual parent, which may be an Addon or Project.
    // We have enough information at this point to check the ember-cli-babel
    // version, so do it.
    let checker = new VersionChecker(parent).for('ember-cli-babel', 'npm');

    if (!checker.satisfies('^6.0.0-beta.1')) {
      project.ui.writeWarnLine(
        'ember-decorators: You are using an unsupported ember-cli-babel version, ' +
        'decorator/class-property transforms will not be included automatically'
      );

      // Opt out of registering since the version is incorrect
      this._registeredWithBabel = true;
    }

    // Parent can either be an Addon or Project. If it is a Project, then ember-decorators is
    // being included in a root level project and needs to register itself on the EmberApp or
    // EmberAddon's options instead
    if (!parent.isEmberCLIProject) {
      this.registerTransformsWithParent(parent);
    }
  },

  included(app) {
    this._super.included.apply(this, arguments);

    // This hook only gets called from top level applications. If it is called and the addon
    // has not already registered itself, it should register itself with the application
    this.registerTransformsWithParent(app);
  },

  /**
   * Registers the decorators and class fields transforms with the parent addon or application
   *
   * @param {Addon|EmberAddon|EmberApp} parent
   */
  registerTransformsWithParent(parent) {
    if (this._registeredWithBabel) return;

    const parentOptions = parent.options = parent.options || {};
    const decoratorOptions = parentOptions.emberDecorators || {};

    if (decoratorOptions.disableTransforms === true) {
      // Opt out of babel transforms
      this._registeredWithBabel = true;
      return;
    }

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

    if (!hasPlugin(plugins, 'transform-class-properties')) {
      plugins.push(TransformClassProperties);
    }

    this._registeredWithBabel = true;
  }
};
