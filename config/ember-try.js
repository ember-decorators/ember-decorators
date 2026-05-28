const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then(urls => {
    return {
      useYarn: true,
      useWorkspaces: true,
      command: 'yarn test',
      scenarios: [
        // Ember Versions
        {
          name: 'ember-lts-3.8',
          npm: {
            devDependencies: {
              'ember-source': '~3.8.0',
            },
          },
        },
        {
          name: 'ember-lts-3.12',
          npm: {
            devDependencies: {
              'ember-source': '~3.12.0',
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0],
            },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1],
            },
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': urls[2],
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
            },
          },
        },

        // Build Flags
        {
          name: 'production',
          env: {
            EMBER_ENV: 'production',
          },
        },
      ],
    };
  });
};
