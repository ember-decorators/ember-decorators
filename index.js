/* eslint-env node */
'use strict';

const setupBabel = require('@ember-decorators/babel-transforms/setup-babel');

module.exports = {
  name: 'ember-decorators',

  // The addon code itself uses no decorators, therefore we can disable
  // `@ember-decorators/babel-transforms`. The only reason this addon is added
  // as a `dependency` (as opposed to `devDependency`) is that we need to shim
  // support for transpilation in the consuming app or addon, since it was
  // originally done inside of `ember-decorators`, but was later extracted into
  // `@ember-decorators/babel-transforms`.
  options: {
    '@ember-decorators/babel-transforms': {
      disable: true
    }
  },

  included(parent) {
    this._super.included.apply(this, arguments);

    if (!('@ember-decorators/babel-transforms' in this.parent.addonPackages)) {
      parent.project.ui.writeWarnLine(
        'ember-decorators: You have not installed @ember-decorators/babel-transforms. ' +
        '@ember-decorators/babel-transforms has been extracted to a separate addon. See instructions for installation:' +
        'https://github.com/ember-decorators/babel-transforms#readme'
      );
    }

    // shim support for `emberDecorators.disableTransforms` and forward the
    // setting to `@ember-decorators/babel-transforms.disable`
    if (parent.options && parent.options.emberDecorators && parent.options.emberDecorators.disableTransforms) {
      parent.options['@ember-decorators/babel-transforms'] = parent.options['@ember-decorators/babel-transforms'] || {};
      parent.options['@ember-decorators/babel-transforms'].disable = true;
    }

    const isDisabled = parent.options &&
      parent.options['@ember-decorators/babel-transforms'] &&
      parent.options['@ember-decorators/babel-transforms'].disable;

    if (!this._registeredWithBabel && !isDisabled) {
      setupBabel(parent);
      this._registeredWithBabel = true;
    }
  }
};
