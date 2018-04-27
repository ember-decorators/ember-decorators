/* eslint-env node */
const EOL = require('os').EOL;
const ModelBlueprint = require('ember-data/blueprints/model');

const _superLocals = ModelBlueprint.locals;

ModelBlueprint.locals = function(options) {
  let generatorImports = {};
  let result = _superLocals.call(ModelBlueprint, options);

  // transform to the class format
  result.attrs = result.attrs
    .split(',' + EOL)
    .map(i => i.trim())
    .map(i => {
      // toppings: DS.hasMany('topping') => [ 'toppings', 'hasMany', 'topping' ]
      const regex = /^(.+):\sDS.(\w+)\((.*)\)$/g;
      let str = i;
      let m;
      let result = [];
      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match) => {
          result.push(match)
        });
      }
      return result.slice(1, 4);
    })
    .map(i => {
      // [ 'toppings', 'hasMany', 'topping' ] => '@hasMany(\'topping\') toppings(){}'
      let result = '';
      if (i.length === 3) {
        generatorImports[i[1]] = true;
        result = `  @${i[1]}(${i[2]}) ${i[0]};`
      }
      return result;
    })
    .join(EOL);

  //add import for generators
  result.generatorImports = Object.keys(generatorImports).join(', ');
  return result;
}

module.exports = ModelBlueprint;
