'use strict';

const EOL = require('os').EOL;
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy model', function() {
  setupTestHooks(this);

  it('model taco', function() {
    let args = ['model', 'taco'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/models/taco.js')).to.contain('import DS from \'ember-data\';' + EOL +
          'const { Model } = DS;' + EOL +
          '' + EOL +
          'export default class TacoModel extends Model {' + EOL +
          '' + EOL +
          '}' + EOL);
      }));
  });

  it('model taco filling:belongs-to:protein ', function() {
    let args = ['model', 'taco', 'filling:belongs-to:protein'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/models/taco.js')).to.contain('import DS from \'ember-data\';' + EOL +
          'const { Model } = DS;' + EOL +
          'import { belongsTo } from \'ember-decorators/data\';' + EOL +
          '' + EOL +
          'export default class TacoModel extends Model {' + EOL +
          '  @belongsTo(\'protein\') filling(){};' + EOL +
          '}' + EOL);
      }));
  });

  it('model taco toppings:has-many:toppings name:string', function() {
    let args = ['model', 'taco', 'toppings:has-many:toppings', 'name:string'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/models/taco.js')).to.contain('import DS from \'ember-data\';' + EOL +
          'const { Model } = DS;' + EOL +
          'import { hasMany, attr } from \'ember-decorators/data\';' + EOL +
          '' + EOL +
          'export default class TacoModel extends Model {' + EOL +
          '  @hasMany(\'topping\') toppings(){};' + EOL +
          '  @attr(\'string\') name(){};' + EOL +
          '}' + EOL);
      }));
  });

  it('model taco toppings:has-many:toppings name:string', function() {
    let args = ['model', 'taco', 'price:number', 'misc'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/models/taco.js')).to.contain('import DS from \'ember-data\';' + EOL +
          'const { Model } = DS;' + EOL +
          'import { attr } from \'ember-decorators/data\';' + EOL +
          '' + EOL +
          'export default class TacoModel extends Model {' + EOL +
          '  @attr(\'number\') price(){};' + EOL +
          '  @attr() misc(){};' + EOL +
          '}' + EOL);
      }));
  });

});
