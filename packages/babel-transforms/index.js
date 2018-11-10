/* eslint-env node */
'use strict';

const setupBabel = require('./private/setup-babel');

module.exports = {
  name: '@babel-decorators/babel-transforms',

  included(parent) {
    this._super.included.apply(this, arguments);

    // Create parent options, if they do not exist
    const parentOptions = (parent.options = parent.options || {});

    // Create our own options, if they do not exist
    const ownOptions = (parentOptions['@ember-decorators/babel-transforms'] =
      parentOptions['@ember-decorators/babel-transforms'] || {});

    if (!this._registeredWithBabel && !ownOptions.disable) {
      setupBabel(parent);
      this._registeredWithBabel = true;
    }
  }
};
