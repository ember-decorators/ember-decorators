module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['ember'],
  extends: ['eslint:recommended', 'plugin:ember/recommended'],
  env: {
    browser: true,
  },
  globals: {
    Ember: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        'config/**/*.js',
        'packages/*/index.js',
        'packages/*/testem.js',
        'packages/*/ember-cli-build.js',
        'packages/*/config/**/*.js',
        'packages/*/tests/dummy/config/**/*.js',
        'packages/*/blueprints/**/*.js',
        'packages/*/node-tests/blueprints/**/*.js',
      ],
      excludedFiles: [
        'packages/*/app/**',
        'packages/*/addon/**',
        'packages/*/tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
      env: {
        browser: false,
        node: true,
      },
      globals: {
        describe: true,
        it: true,
        beforeEach: true,
      },
      plugins: ['node'],
      rules: Object.assign(
        {},
        require('eslint-plugin-node').configs.recommended.rules,
        {
          'node/no-unpublished-require': 'off',
        }
      ),
    },
  ],
};
