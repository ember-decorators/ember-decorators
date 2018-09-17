'use strict';
const fs = require('fs');
const walkSync = require('walk-sync');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

const UnwatchedDir = require('broccoli-source').UnwatchedDir;
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

function treeForPackage(packageName) {
  let addonFiles = new Funnel(`../${packageName}/addon`, {
    destDir: `@ember-decorators/${packageName}`
  });

  return addonFiles;
}

module.exports = function(defaults) {
  if (process.env.GENERATE_TYPESCRIPT_TESTS) {
    // Generate typescript test files
    walkSync('tests').forEach((path) => {
      if (path.includes('-test.js') && !path.includes('temp-typescript')) {
        let fullPath = `tests/${path}`;

        let file = fs.readFileSync(fullPath, { encoding: 'utf8' });

        file = file.replace('javascript |', 'typescript |');

        fs.writeFileSync(fullPath.replace('-test.js', '-temp-typescript-test.ts'), file);
      }
    });
  }

  // Build addon docs tree
  let baseFiles = new Funnel(new UnwatchedDir('./'), {
    include: ['package.json', 'README.md']
  });

  let tree = new MergeTrees([
    baseFiles,
    treeForPackage('component'),
    treeForPackage('controller'),
    treeForPackage('data'),
    treeForPackage('object'),
    treeForPackage('service'),
  ]);

  var app = new EmberAddon(defaults, {
    'ember-cli-addon-docs': {
      projects: {
        main: tree
      }
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
