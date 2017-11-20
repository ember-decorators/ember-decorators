/* eslint-env node */
'use strict';

const BabelTransforms = require('@ember-decorators/babel-transforms');

module.exports = Object.create(BabelTransforms, {
  name: {
    enumerable: true,
    value: 'ember-decorators'
  }
});
