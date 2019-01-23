/* eslint-env node */
'use strict';

module.exports = {
  name: '@babel-decorators/babel-transforms',

  included(parent) {
    this._super.included.apply(this, arguments);

    // Create parent options, if they do not exist
    let parentOptions = (this.app || this.parent).options || {}

    // Create and extract own options, if they do not exist
    let { decoratorsBeforeExport = true } = parentOptions['@ember-decorators/babel-transforms'] || {};

    if (!this._registeredWithBabel) {
      let VersionChecker = require('ember-cli-version-checker');
      let { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');

      let checker = new VersionChecker(parent).for('ember-cli-babel', 'npm');

      // The decorators transform must come before the class-properties transform, so we constrain the decorators
      // plugin when we add it to come before class-properties if it's already there.
      if (checker.gte('7.0.0')) {
        if (!hasPlugin(parent, '@babel/plugin-proposal-decorators')) {
          addPlugin(
            parent,
            [require.resolve('@babel/plugin-proposal-decorators'), { decoratorsBeforeExport }],
            {
              before: ['@babel/plugin-proposal-class-properties'],
            }
          );
        }

        if (!hasPlugin(parent, '@babel/plugin-proposal-class-properties')) {
          addPlugin(parent, [
            require.resolve('@babel/plugin-proposal-class-properties'),
            { loose: true },
          ]);
        }
      } else {
        parent.project.ui.writeWarnLine(
          '@ember-decorators/babel-transforms: You are using an unsupported ember-cli-babel version, decorator/class-property transforms will not be included automatically'
        );
      }

      this._registeredWithBabel = true;
    }
  },
};
