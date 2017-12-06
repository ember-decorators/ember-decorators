/* eslint-env node */
'use strict';

const BabelTransforms = require('@ember-decorators/babel-transforms');

module.exports = Object.assign({}, BabelTransforms, {
  name: 'ember-decorators',

  included(parent) {
    // shim support for `emberDecorators.disableTransforms` and forward the
    // setting to `@ember-decorators/babel-transforms.disable`
    if (parent.options && parent.options.emberDecorators && parent.options.emberDecorators.disableTransforms) {
      parent.options['@ember-decorators/babel-transforms'] = parent.options['@ember-decorators/babel-transforms'] || {};
      parent.options['@ember-decorators/babel-transforms'].disable = true;
    }

    BabelTransforms.included.apply(this, arguments);
  }
});
