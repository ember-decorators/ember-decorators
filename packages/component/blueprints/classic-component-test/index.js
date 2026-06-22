const path = require('path');
// eslint-disable-next-line node/no-missing-require
const ComponentTestBlueprint = require('ember-source/blueprints/component-test');

module.exports = Object.assign({}, ComponentTestBlueprint, {
  init() {
    this._super.init.apply(this, arguments);

    // eslint-disable-next-line node/no-missing-require
    this.path = path.dirname(require.resolve('ember-source/blueprints/component-test'));
  },

  fileMapTokens() {
    let map = ComponentTestBlueprint.fileMapTokens.apply(this, arguments);

    map.__test__ = options =>
      options.pod ? 'component-test' : `${options.dasherizedModuleName}-test`;

    return map;
  },
});
