'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'dummy',
    podModulePrefix: 'dummy/pods',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
    },

    APP: {},
  };

  if (environment === 'development') {
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // Allow ember-cli-addon-docs to update the rootURL in compiled assets
    ENV.rootURL = 'ADDON_DOCS_ROOT_URL';
  }

  return ENV;
};
