const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then((urls) => {
    return {
      useYarn: true,
      useWorkspaces: true,
      command: 'yarn test',
      scenarios: [

        // Ember Versions
        {
          name: 'ember-lts-2.16',
          npm: {
            devDependencies: {
              'ember-source': '~2.16.0',
              'ember-data': '~2.16.0'
            },
          },
        },
        {
          name: 'ember-lts-2.18',
          npm: {
            devDependencies: {
              'ember-source': '~2.18.0',
              'ember-data': '~2.18.0'
            },
          },
        },
        {
          name: 'ember-lts-3.4',
          npm: {
            devDependencies: {
              'ember-source': '~3.4.0',
              'ember-data': '~3.4.0'
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0],
              'ember-data': 'emberjs/data#release'
            },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1],
              'ember-data': 'emberjs/data#beta'
            },
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': urls[2],
              'ember-data': 'emberjs/data#master'
            },
          },
        },
        {
          name: 'ember-default',
        },

        // Alternate Transpilers
        {
          name: 'typescript',
          env: {
            GENERATE_TYPESCRIPT_TESTS: true,
          },
        },
        {
          name: 'stage-1-transforms',
          npm: {
            devDependencies: {
              '@ember-decorators/babel-transforms': '^2.0.0',
            }
          }
        },

        // Build Flags
        {
          name: 'production',
          env: {
            EMBER_ENV: 'production',
          },
        },
        {
          name: 'forced-stage-1-build',
          env: {
            EMBER_DECORATORS_NEEDS_STAGE_1_DECORATORS: true,
          },
        },
      ],
    };
  });
};
