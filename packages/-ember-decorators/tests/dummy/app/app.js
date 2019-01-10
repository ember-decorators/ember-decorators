/* globals define */
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import EmberRouter from '@ember/routing/router';

// Including ember-cli-addon-docs is having issues with earlier versions of Node
// due to dependencies that require Node v8, this is a temporary measure so we
// don't have to drop Node v6 support
define('ember-cli-addon-docs/router', () => {
  return EmberRouter;
});

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
