'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let trees;

  if (process.env.GENERATE_TYPESCRIPT_TESTS) {
    const Funnel = require('broccoli-funnel');
    trees = {
      tests: new Funnel('tests', {
        getDestinationPath(path) {
          return path.replace('.js', '.ts');
        },
      }),
    };
  } else {
    trees = {
      tests: 'tests',
    };
  }

  var app = new EmberAddon(defaults, {
    trees,

    '@ember-decorators/babel-transforms': {
      decoratorsBeforeExport: false,
    },

    'ember-cli-uglify': {
      uglify: {
        compress: {
          collapse_vars: false,
        },
      },
    },
  });

  return app.toTree();
};
