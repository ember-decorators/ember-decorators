'use strict';
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

  let trees;

  if (process.env.GENERATE_TYPESCRIPT_TESTS) {
    trees = {
      tests: new Funnel('tests', {
        getDestinationPath(path) {
          return path.replace('.js', '.ts');
        },
      }),
    };
  } else {
    trees = {
      tests: 'tests'
    };
  }

  var app = new EmberAddon(defaults, {
    trees,

    'ember-cli-uglify': {
			uglify: {
				compress: {
					collapse_vars: false
				}
			}
		},

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
