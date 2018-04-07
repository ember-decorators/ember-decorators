'use strict';

var EOL                = require('os').EOL;
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy model', function() {
  setupTestHooks(this);

  it('model foo', function() {
    let args = ['model', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/models/foo.js')).to.contain('import DS from \'ember-data\';'+EOL +
          ''+EOL +
          'const { Model } = DS;'+EOL +
          ''+EOL +
          'export default class FooModel extends Model {'+EOL +
          ''+EOL +
          '}');
    }));
  });
});
