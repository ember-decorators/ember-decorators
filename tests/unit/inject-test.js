import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import { test } from 'qunit';

/* jshint ignore:start */
import { service, controller } from 'ember-computed-decorators/inject';
/* jshint ignore:end */

moduleFor('Inject Decorators', {
  integration: true
});

test('service decorator works without service name', function(assert) {
  const FooService = Ember.Object.extend();

  this.register('service:foo', FooService);

  this.register('class:baz', Ember.Object.extend({
    /* jshint ignore:start */
    @service foo
    /* jshint ignore:end */
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooService, 'service injected correctly');
});

test('service decorator works with service name', function(assert) {
  const FooService = Ember.Object.extend();

  this.register('service:foo', FooService);

  this.register('class:baz', Ember.Object.extend({
    /* jshint ignore:start */
    @service('foo') fooService
    /* jshint ignore:end */
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('fooService') instanceof FooService, 'service injected correctly');
});

test('controller decorator works without controller name', function(assert) {
  const FooController = Ember.Controller.extend();

  this.register('controller:foo', FooController);

  this.register('class:baz', Ember.Controller.extend({
    /* jshint ignore:start */
    @controller foo
    /* jshint ignore:end */
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooController, 'service injected correctly');
});

test('controller decorator works with controller name', function(assert) {
  const FooController = Ember.Controller.extend();

  this.register('controller:foo', FooController);

  this.register('class:baz', Ember.Controller.extend({
    /* jshint ignore:start */
    @controller('foo') foo
    /* jshint ignore:end */
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooController, 'service injected correctly');
});
