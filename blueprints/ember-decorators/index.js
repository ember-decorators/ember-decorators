/* eslint-env node */
module.exports = {
  description: 'Adds @ember-decorators/babel-transforms to the parent app',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonToProject({
      name: '@ember-decorators/babel-transforms',
      target: '^2.0.0'
    });
  }
};
