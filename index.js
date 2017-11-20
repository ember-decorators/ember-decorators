/* eslint-env node */
'use strict';

const BabelTransforms = require('@ember-decorators/babel-transforms');

module.exports = Object.assign({}, BabelTransforms, {
  name: 'ember-decorators'
});
