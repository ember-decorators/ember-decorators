// Test infra downgrades for older ember-source versions
const legacyTestDeps = {
  'ember-qunit': '^5.1.5',
  '@ember/test-helpers': '^2.4.2',
  'ember-resolver': '^8.1.0',
};

// no-implicit-route-model didn't exist before 3.28
const optionalFeaturesLegacy = {
  'config/optional-features.json': JSON.stringify({
    'application-template-wrapper': false,
    'default-async-observers': true,
    'jquery-integration': false,
    'template-only-glimmer-components': true,
  }),
};

export default {
  packageManager: 'pnpm',
  scenarios: [
    {
      name: 'ember-lts-3.8',
      npm: {
        devDependencies: {
          'ember-source': '~3.8.0',
          ...legacyTestDeps,
        },
      },
      files: optionalFeaturesLegacy,
    },
    {
      name: 'ember-lts-3.12',
      npm: {
        devDependencies: {
          'ember-source': '~3.12.0',
          ...legacyTestDeps,
        },
      },
      files: optionalFeaturesLegacy,
    },
    {
      name: 'ember-lts-3.16',
      npm: {
        devDependencies: {
          'ember-source': '~3.16.0',
          ...legacyTestDeps,
        },
      },
      files: optionalFeaturesLegacy,
    },
    {
      name: 'ember-lts-3.20',
      npm: {
        devDependencies: {
          'ember-source': '~3.20.0',
          ...legacyTestDeps,
        },
      },
      files: optionalFeaturesLegacy,
    },
    {
      name: 'ember-lts-3.24',
      npm: {
        devDependencies: {
          'ember-source': '~3.24.0',
          ...legacyTestDeps,
        },
      },
      files: optionalFeaturesLegacy,
    },
    {
      name: 'ember-lts-3.28',
      npm: {
        devDependencies: {
          'ember-source': '~3.28.0',
        },
      },
    },
    {
      name: 'ember-lts-4.4',
      npm: {
        devDependencies: {
          'ember-source': '~4.4.0',
        },
      },
    },
    {
      name: 'ember-lts-4.8',
      npm: {
        devDependencies: {
          'ember-source': '~4.8.0',
        },
      },
    },
    {
      name: 'ember-lts-4.12',
      npm: {
        devDependencies: {
          'ember-source': '~4.12.0',
        },
      },
    },
  ],
};
