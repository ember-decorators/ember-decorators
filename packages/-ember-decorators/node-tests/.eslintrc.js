module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  extends: 'eslint:recommended',
  env: {
    mocha: true,
    node: true,
    qunit: true
  },
  globals: {
    Map: false,
    Set: false
  },
  rules: {
    'semi': 'error',
    'no-unused-vars': 'error'
  }
};
