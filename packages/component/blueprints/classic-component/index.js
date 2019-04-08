const ComponentBlueprint = require('ember-source/blueprints/component');

module.exports = Object.assign({}, ComponentBlueprint, {
  fileMapTokens() {
    let map = ComponentBlueprint.fileMapTokens.apply(this, arguments);

    map.__name__ = options => (options.pod ? 'component' : options.dasherizedModuleName);

    return map;
  },
});
