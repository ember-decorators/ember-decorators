module.exports = {
  scenarios: [
    {
      name: 'ember-1.13.x',
      dependencies: {
        'ember': '1.13.10',
        'ember-data': '2.0.0'
      }
    },
    {
      name: 'ember-2.0.x',
      dependencies: {
        'ember': '2.0.2',
        'ember-data': '2.0.0'
      }
    },
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
