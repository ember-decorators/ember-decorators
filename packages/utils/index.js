const semver = require('semver');
const VersionChecker = require('ember-cli-version-checker');

const PLUGIN_NAME = 'ember-decorators-debug-macros';

// used as a way to memoize needsStage1Decorators so that we can avoid many many
// top down searches of the addon heirarchy
const NEEDS_STAGE_1_DECORATORS = new WeakMap();

function cleanVersion(version) {
  if (version === undefined) return false;

  let matchedVersion = version.match(/\d\.\d\.\d/);

  return matchedVersion && matchedVersion[0];
}

function checkNeedsStage1Decorators(project) {
  if (NEEDS_STAGE_1_DECORATORS.has(project)) {
    return NEEDS_STAGE_1_DECORATORS.get(project);
  }

  let needsStage1Decorators = checkAddonsForStage1(project, project);

  NEEDS_STAGE_1_DECORATORS.set(project, !!needsStage1Decorators);

  return needsStage1Decorators;
}

function checkAddonsForStage1(project, addonOrProject) {
  if (!addonOrProject.pkg) {
    // for some reason we couldn't read package.json, return true to be safe
    project.ui.writeWarnLine(`unable to read package.json for ${addonOrProject.name}, including stage 1 decorators by default`);

    return true;
  }

  let { dependencies = {}, devDependencies = {} } = addonOrProject.pkg;

  let checker = new VersionChecker(addonOrProject);

  // check if decorators are in deps at all. We must check directly because it's
  // possible to "bubble" up to the main app's decorators, and we may give a
  // false positive.
  let hasDecorators = [
    'ember-decorators',
    '@ember-decorators/component',
    '@ember-decorators/controller',
    '@ember-decorators/data',
    '@ember-decorators/object',
    '@ember-decorators/service',
    '@ember-decorators/utils',
  ].some(d => d in dependencies);

  // check the resolved version of decorators. This could end up being the root
  // application's version of decorators, so we need to use ec-version-checker.
  let hasOlderDecorators = checker.for('@ember-decorators/utils', 'npm').lt('3.1.0');

  // If embroiderer comes through this will need to update.
  let hasOlderTransforms = checker.for('@ember-decorators/babel-transforms', 'npm').lt('3.1.0');

  // If the dev dependency exists and is readable, we use that. Otherwise, we
  // default to the installed version if it exists. This should cover in-repo
  // addons/engines, while also covering most addons that used TS in development
  // and shipped built packages.
  let devTSVersion = cleanVersion(devDependencies['ember-cli-typescript']);
  let hasOlderTypescript =
    (devTSVersion && semver.lt(devTSVersion, '2.0.0-beta.1')) ||
    checker.for('ember-cli-typescript', 'npm').lt('2.0.0-beta.1');

  let needsStage1 = false;

  let addonOrProjectMessage =
    addonOrProject.isEmberCLIProject && addonOrProject.isEmberCLIProject()
      ? 'Your app'
      : `The '${addonOrProject.name}' addon`;

  if (hasDecorators && hasOlderTypescript) {
    project.ui.writeWarnLine(
      `${addonOrProjectMessage} is using an older version of ember-cli-typescript that uses stage 1 decorators. Please update to ember-cli-typescript@v2 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  if (hasDecorators && hasOlderTransforms) {
    project.ui.writeWarnLine(
      `${addonOrProjectMessage} is using an older version of @ember-decorators/babel-transforms that uses stage 1 decorators. Please update to @ember-decorators/babel-transforms@v3.1 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  if (hasDecorators && hasOlderDecorators) {
    project.ui.writeWarnLine(
      `${addonOrProjectMessage} is using an older version of ember-decorators that uses stage 1 decorators. Please update to ember-decorators@v3.1 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  // return late so we print all possible warnings
  if (needsStage1) {
    return true;
  }

  if (addonOrProject.addons) {
    return addonOrProject.addons.some(addon => checkAddonsForStage1(project, addon));
  }

  return false;
}

function setupBabelPlugins(project, addon) {
  addon.options = addon.options || {};
  addon.options.babel = addon.options.babel || {};

  let plugins = (addon.options.babel.plugins = addon.options.babel.plugins || []);

  // If the plugin is already configure, skip.
  if (plugins.some(p => Array.isArray(p) && p[2] === PLUGIN_NAME)) return;

  let needsStage1Decorators =
    process.env.EMBER_DECORATORS_NEEDS_STAGE_1_DECORATORS === 'true' ||
    checkNeedsStage1Decorators(project);

  let pluginOptions = {
    debugTools: {
      isDebug: false,
      source: 'ember-decorators-flags',
    },

    flags: [
      {
        name: 'ember-decorators-flags',
        source: 'ember-decorators-flags',
        flags: {
          NEEDS_STAGE_1_DECORATORS: needsStage1Decorators,
        },
      }
    ]
  };

  plugins.push([require.resolve('babel-plugin-debug-macros'), pluginOptions, PLUGIN_NAME]);
}

module.exports = {
  name: '@ember-decorators/utils',

  included(includer) {
    this._super.included.apply(this, arguments);

    let host = this._findHost();
    let hostOptions = (host.options && host.options['@ember-decorators']) || {};

    setupBabelPlugins(this.project, this, hostOptions);
    setupBabelPlugins(this.project, includer, hostOptions);
  },
};
