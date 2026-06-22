// eslint-disable-next-line node/no-missing-require
const AddonImportBlueprint = require('ember-source/blueprints/component-addon');

module.exports = Object.assign({}, AddonImportBlueprint, {
  locals(options) {
    options.originBlueprintName = 'component';

    return AddonImportBlueprint.locals(options);
  },
});
