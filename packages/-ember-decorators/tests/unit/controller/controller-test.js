import Controller from '@ember/controller';
import { moduleFor } from 'ember-qunit';
import { test } from 'qunit';

import { controller } from '@ember-decorators/controller';

moduleFor('@controller', { integration: true });

test('it works', function(assert) {
  const FooController = Controller.extend();

  this.register('controller:foo', FooController);

  class BarController extends Controller {
    @controller foo;
  }

  this.register('controller:bar', BarController);

  const bar = this.container.lookup('controller:bar');

  assert.ok(bar.get('foo') instanceof FooController, 'controller injected correctly');
});

test('controller decorator works with controller name', function(assert) {
  const FooController = Controller.extend();

  this.register('controller:foo', FooController);

  class BarController extends Controller {
    @controller('foo') baz;
  }

  this.register('controller:bar', BarController);

  const bar = this.container.lookup('controller:bar');

  assert.ok(bar.get('baz') instanceof FooController, 'controller injected correctly');
});


test('can set controller field', function(assert) {
  assert.expect(0);

  const FooController = Controller.extend();

  this.register('controller:foo', FooController);

  class BarController extends Controller {
    @controller foo
  }

  this.register('controller:bar', BarController);

  const bar = this.container.lookup('controller:bar');

  bar.set('foo', FooController.create());
});
