const VersionChecker = require('ember-cli-version-checker');

const PLUGIN_NAME = 'ember-decorators-debug-macros';

// used as a way to memoize needsStage1Decorators so that we can avoid many many
// top down searches of the addon heirarchy
const NEEDS_STAGE_1_DECORATORS = new WeakMap();

function checkNeedsStage1Decorators(project) {
  if (NEEDS_STAGE_1_DECORATORS.has(project)) {
    return NEEDS_STAGE_1_DECORATORS.get(project);
  }

  let needsStage1Decorators = checkAddonsForStage1(project, project);

  NEEDS_STAGE_1_DECORATORS.set(project, !!needsStage1Decorators);

  return needsStage1Decorators;
}

function checkAddonsForStage1(project, addon) {
  if (!addon.addons || !addon.addons.length > 0) return false;

  let checker = new VersionChecker(addon);

  let decoratorChecker = checker.for('@ember-decorators/utils', 'npm');
  let hasDecorators = decoratorChecker.exists();
  let hasOlderDecorators = decoratorChecker.lt('3.1.0');

  let hasOlderTypescript = checker.for('ember-cli-typescript', 'npm').lt('2.0.0-beta.1');
  let hasOlderTransforms = checker.for('@ember-decorators/babel-transforms', 'npm').lt('3.1.0');

  let needsStage1 = false;

  if (hasDecorators && hasOlderTypescript) {
    project.ui.writeWarnLine(
      `The '${
        addon.name()
      }' addon is using an older version of ember-cli-typescript that uses stage 1 decorators. Please update this addon to ember-cli-typescript@v2 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  if (hasDecorators && hasOlderTransforms) {
    project.ui.writeWarnLine(
      `The '${
        addon.name()
      }' addon is using an older version of @ember-decorators/babel-transforms that uses stage 1 decorators. Please update this addon to @ember-decorators/babel-transforms@v3.1 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  if (hasOlderDecorators) {
    project.ui.writeWarnLine(
      `The '${
        addon.name()
      }' addon is using an older version of ember-decorators that uses stage 1 decorators. Please update this addon to ember-decorators@v3.1 to remove your dependency on legacy decorators.`
    );

    needsStage1 = true;
  }

  // return late so we print all possible warnings
  if (needsStage1) {
    return true;
  }

  return addon.addons.some(addon => checkAddonsForStage1(project, addon));
}

function setupBabelPlugins(project, addon, options) {
  addon.options = addon.options || {};
  addon.options.babel = addon.options.babel || {};

  let plugins = (addon.options.babel.plugins = addon.options.babel.plugins || []);

  // If the plugin is already configure, skip.
  if (plugins.some(p => Array.isArray(p) && p[2] === PLUGIN_NAME)) return;

  let shouldThrowOnComputedOverride =
    process.env.EMBER_DECORATORS_THROW_ON_COMPUTED_OVERRIDE === 'true' ||
    options.shouldThrowOnComputedOverride;

  let needsStage1Decorators =
    process.env.EMBER_DECORATORS_NEEDS_STAGE_1_DECORATORS === 'true' ||
    checkNeedsStage1Decorators(project);

  let pluginOptions = {
    envFlags: {
      source: 'ember-decorators-flags',
      flags: {
        DEBUG: false,
      },
    },

    features: {
      name: 'ember-decorators-flags',
      source: 'ember-decorators-flags',
      flags: {
        THROW_ON_COMPUTED_OVERRIDE: shouldThrowOnComputedOverride,
        NEEDS_STAGE_1_DECORATORS: needsStage1Decorators,
      },
    },

    externalizeHelpers: {
      global: 'Ember',
    },

    debugTools: {
      source: 'ember-decorators-flags',
      assertPredicateIndex: 1,
    },
  };

  plugins.push([require.resolve('babel-plugin-debug-macros'), pluginOptions, PLUGIN_NAME]);
}

module.exports = {
  name: '@ember-decorators/utils',

  included(includer) {
    this._super.included.apply(this, arguments);

    let host = this._findHost();
    let hostOptions = (host.options && host.options['@ember-decorators']) || {
      shouldThrowOnComputedOverride: false,
    };

    setupBabelPlugins(this.project, this, hostOptions);
    setupBabelPlugins(this.project, includer, hostOptions);
  },
};
