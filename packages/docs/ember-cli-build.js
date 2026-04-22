'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

function treeForPackage(packageName) {
  return new Funnel(`../${packageName}/src`, {
    destDir: `@ember-decorators/${packageName}`,
  });
}

module.exports = function (defaults) {
  let tree = new MergeTrees([
    treeForPackage('component'),
    treeForPackage('object'),
  ]);

  var app = new EmberAddon(defaults, {
    'ember-cli-addon-docs': {
      projects: {
        main: tree,
      },
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [{ package: 'qunit' }],
  });
};
