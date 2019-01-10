import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('what-is-ember-decorators');
    this.route('why-go-native');
    this.route('stability-and-support');

    this.route('native-class-basics');
    this.route('class-fields');
    this.route('decorators');
    this.route('notable-differences');
    this.route('cheat-sheet');
    this.route('specs');
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
