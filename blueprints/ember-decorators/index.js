/* eslint-env node */
module.exports = {
  description: 'Adds @ember-decorators/babel-transforms to the parent app',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonToProject('@ember-decorators/babel-transforms');
  }
};
