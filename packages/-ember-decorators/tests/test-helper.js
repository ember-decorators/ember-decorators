/* globals define */
import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import EmberRouter from '@ember/routing/router';

import { lte } from 'ember-compatibility-helpers';

// Including ember-cli-addon-docs breaks certain versions of Ember when testing
// but they also break if we remove it. This defines a stub router which should
// prevent breakage.
if (lte('2.5.0')) {
  define('ember-cli-addon-docs/router', () => {
    return EmberRouter;
  });
}

setApplication(Application.create(config.APP));

start();
