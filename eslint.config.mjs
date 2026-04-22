import babelParser from '@babel/eslint-parser/experimental-worker';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import ember from 'eslint-plugin-ember/recommended';
import importPlugin from 'eslint-plugin-import';
import n from 'eslint-plugin-n';
import globals from 'globals';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
};

export default defineConfig([
  globalIgnores([
    '**/dist/',
    '**/dist-*/',
    '**/declarations/',
    '**/coverage/',
    '**/*.d.ts',
    '!**/.*',
    'packages/docs/',
  ]),
  js.configs.recommended,
  prettier,
  ember.configs.base,
  ember.configs.gjs,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
        },
      },
    },
  },
  {
    files: ['**/*.{js,gjs}'],
    languageOptions: {
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/src/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }],
      'no-prototype-builtins': 'off',
      'ember/no-observers': 'off',
      'ember/no-classic-components': 'off',
    },
  },
  {
    files: ['**/tests/**/*'],
    rules: {
      'ember/no-observers': 'off',
      'ember/no-classic-components': 'off',
      'ember/no-classic-classes': 'off',
      'ember/no-computed-properties-in-native-classes': 'off',
      'ember/classic-decorator-hooks': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    plugins: {
      n,
    },
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.mjs'],
    plugins: {
      n,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
]);
