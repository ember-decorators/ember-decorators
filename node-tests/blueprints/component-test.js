'use strict';

const EOL = require('os').EOL;
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy component', function() {
  setupTestHooks(this);

  it('ember g component chili-taco', function() {
    let args = ['component', 'chili-taco'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/components/chili-taco.js')).to.contain(
          'import Component from \'@ember/component\';' + EOL +
          '' + EOL +
          'export default class ChiliTacoComponent extends Component {' + EOL +
          '' + EOL +
          '}' + EOL
        );
        expect(file('app/templates/components/chili-taco.hbs')).to.contain('{{yield}}');
      }));
  });

});
