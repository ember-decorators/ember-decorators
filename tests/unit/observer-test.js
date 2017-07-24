import Ember from 'ember';
import { observer, observes } from 'ember-decorators/object';
import { module, test } from 'qunit';

module('observer decorators');

test('observers on ES Classes trigger', function(assert) {
  assert.expect(1);

  @observer
  class Foo extends Ember.Object {
    @observes('foo')
    bar() {
      assert.ok(true, 'observer triggered correctly');
    }
  }

  const foo = Foo.create();
  foo.set('foo', true);
});

test('inherited events from Ember Objects trigger', function(assert) {
  assert.expect(1);

  const Foo = Ember.Object.extend({
    @observes('foo')
    bar() {
      assert.ok(true, 'observer triggered correctly');
    }
  });

  @observer
  class Bar extends Foo {}

  const bar = Bar.create();
  bar.set('foo', true);
});


test('overridden events from Ember Objects do not trigger', function(assert) {
  assert.expect(0);

  const Foo = Ember.Object.extend({
    @observes('foo')
    bar() {
      // Do nothing...
    }
  });

  @observer
  class Bar extends Foo {
    bar() {
      assert.ok(false, 'observer triggered when it should not have');
    }
  }

  const bar = Bar.create();
  bar.set('foo', true);
});

test('inherited events from ES Classes trigger', function(assert) {
  assert.expect(1);

  @observer
  class Foo extends Ember.Object {
    @observes('foo')
    bar() {
      assert.ok(true, 'observer triggered correctly');
    }
  }

  class Bar extends Foo {}

  const bar = Bar.create();
  bar.set('foo', true);
});

test('overridden events from ES Classes do not trigger', function(assert) {
  assert.expect(0);

  const Foo = Ember.Object.extend({
    @observes('foo')
    bar() {
    }
  });

  @observer
  class Bar extends Foo {
    bar() {
      assert.ok(false, 'observer triggered when it should not have');
    }

    @observes('foo')
    baz() {
      // Do nothing...
    }
  }

  class Baz extends Bar {
    baz() {
      assert.ok(false, 'observer triggered when it should not have');
    }
  }

  const baz = Baz.create();
  baz.set('foo', true);
});
