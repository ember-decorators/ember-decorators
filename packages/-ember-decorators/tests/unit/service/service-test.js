import EmberObject from '@ember/object';
import { moduleFor } from 'ember-qunit';
import { test } from 'qunit';

import { service } from '@ember-decorators/service';

moduleFor('javascript | @service', { integration: true });

test('it works', function(assert) {
  const FooService = EmberObject.extend();

  this.register('service:foo', FooService);

  class Baz extends EmberObject {
    @service foo
  }

  this.register('class:baz', Baz);

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('foo') instanceof FooService, 'service injected correctly');
});

test('it works by passing name', function(assert) {
  const FooService = EmberObject.extend();

  this.register('service:foo', FooService);

  class Baz extends EmberObject {
    @service('foo') bar
  }

  this.register('class:baz', Baz);

  const baz = this.container.lookup('class:baz');

  assert.ok(baz.get('bar') instanceof FooService, 'service injected correctly');
});

test('can set service field', function(assert) {
  assert.expect(0);

  const FooService = EmberObject.extend();

  this.register('service:foo', FooService);

  class Baz extends EmberObject {
    @service foo
  }

  this.register('class:baz', Baz);

  const baz = this.container.lookup('class:baz');

  baz.set('foo', FooService.create());
});
