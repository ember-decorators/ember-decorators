import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import { test } from 'qunit';

import { controller } from 'ember-decorators/controller';
import { service } from 'ember-decorators/service';

moduleFor('Inject Decorators', {
  integration: true
});

test('service decorator works without service name', function(assert) {
  const FooService = Ember.Object.extend();

  this.register('service:foo', FooService);

  this.register('class:baz', Ember.Object.extend({
    @service foo: null
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooService, 'service injected correctly');
});

test('service decorator works with service name', function(assert) {
  const FooService = Ember.Object.extend();

  this.register('service:foo', FooService);

  this.register('class:baz', Ember.Object.extend({
    @service('foo') fooService: null
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('fooService') instanceof FooService, 'service injected correctly');
});

test('controller decorator works without controller name', function(assert) {
  const FooController = Ember.Controller.extend();

  this.register('controller:foo', FooController);

  this.register('class:baz', Ember.Controller.extend({
    @controller foo: null
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooController, 'service injected correctly');
});

test('controller decorator works with controller name', function(assert) {
  const FooController = Ember.Controller.extend();

  this.register('controller:foo', FooController);

  this.register('class:baz', Ember.Controller.extend({
    @controller('foo') foo: null
  }));

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooController, 'service injected correctly');
});
