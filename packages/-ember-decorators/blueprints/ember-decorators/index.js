/* eslint-env node */
const semver = require('semver');

module.exports = {
  description: 'Adds @ember-decorators/babel-transforms to the parent app',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    const name = '@ember-decorators/babel-transforms';
    const target = '^2.0.0';

    const emberCLIVersion = this.project.emberCLIVersion();
    const minEmberCLIVersion = '2.16.0';

    if (semver.lt(emberCLIVersion, minEmberCLIVersion)) {
      // Installing an addon with a scoped packages name is only supported since ember-cli 2.16.0-beta.1
      // https://github.com/ember-cli/ember-cli/commit/a69016db62bdae2ac76acb1b98c9f789223cf083
      this.project.ui.writeWarnLine(
        'Could not automatically install the required dependency ' + name +
        '. You are using an outdated version (v' + emberCLIVersion + ') of ember-cli.'
      );
      this.project.ui.writeInfoLine(
        'You can fix this by either updating ember-cli to at least v' +
        minEmberCLIVersion + ' or manually installing ' + name + ', like so:'
      );
      this.project.ui.writeInfoLine('');
      this.project.ui.writeInfoLine('  For npm users:   npm install -D ' + name + '@' + target);
      this.project.ui.writeInfoLine('  For yarn users:  yarn add -D ' + name + '@' + target);
      this.project.ui.writeInfoLine('');
    } else {
      return this.addAddonToProject({ name, target });
    }
  }
};
