/* eslint-env node */
'use strict';

/**
 * Please *do not* import this file in your project. We put this here for
 * backwards compatibility reasons with the ember-decorators main package.
 *
 * This is explicitly private API and not intended for use inside third-party
 * addons.
 *
 * If you find yourself in need of importing this file, because babel-transforms
 * does not serve your special use case, please open an issue instead and let us
 * find a solution. :)
 */

const VersionChecker = require('ember-cli-version-checker');
const { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');

function requireTransform(transformName) {
  return require.resolve(transformName);
}

module.exports = function setupBabel(parent) {
  const checker = new VersionChecker(parent).for('ember-cli-babel', 'npm');

  // The decorators transform must come before the class-properties transform, so we constrain the decorators
  // plugin when we add it to come before class-properties if it's already there.

  if (checker.satisfies('^6.0.0-beta.1')) {
    if (!hasPlugin(parent, 'transform-decorators-legacy')) {
      addPlugin(parent, requireTransform('babel-plugin-transform-decorators-legacy', {
        before: ['transform-class-properties']
      }));
    }

    if (!hasPlugin(parent, 'transform-class-properties')) {
      addPlugin(parent, requireTransform('babel-plugin-transform-class-properties'));
    }
  } else if (checker.gte('7.0.0')) {
    if (!hasPlugin(parent, '@babel/plugin-proposal-decorators')) {
      addPlugin(parent, [requireTransform('@babel/plugin-proposal-decorators'), { legacy: true }], {
        before: ['@babel/plugin-proposal-class-properties']
      });
    }

    if (!hasPlugin(parent, '@babel/plugin-proposal-class-properties')) {
      addPlugin(parent, [requireTransform('@babel/plugin-proposal-class-properties'), { loose: true }]);
    }
  } else {
    parent.project.ui.writeWarnLine(
      '@ember-decorators/babel-transforms: You are using an unsupported ember-cli-babel version, decorator/class-property transforms will not be included automatically'
    );
  }
};
