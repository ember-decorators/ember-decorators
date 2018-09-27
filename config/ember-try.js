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
          env: {
            GENERATE_TYPESCRIPT_TESTS: true,
          },
          npm: {
            devDependencies: {
              'ember-cli-typescript': '^1.3.0',
              'typescript': '~2.8.3',
            }
          }
        },
        {
          name: 'throw-on-computed-override',
          env: {
            EMBER_DECORATORS_THROW_ON_COMPUTED_OVERRIDE: true,
          },
          npm: {
            devDependencies: {}
          },
        },
      ],
    };
  });
};
