/* eslint-env node */
'use strict';

const setupBabel = require('@ember-decorators/babel-transforms/setup-babel');

module.exports = {
  name: 'ember-decorators',

  included(parent) {
    this._super.included.apply(this, arguments);

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
