import Ember from 'ember';
import { evented, on } from 'ember-decorators/object/evented';
import { module, test } from 'qunit';

module('evented decorators');

test('events on ES Classes trigger', function(assert) {
  assert.expect(1);

  @evented
  class Foo extends Ember.Object {
    @on('init')
    onInit() {
      assert.ok(true, 'init event triggered correctly');
    }
  }

  Foo.create();
});

test('inherited events from Ember Objects trigger', function(assert) {
  assert.expect(1);

  const Foo = Ember.Object.extend({
    @on('init')
    onInit() {
      assert.ok(true, 'init event triggered correctly');
    }
  });

  @evented
  class Bar extends Foo {}

  Bar.create();
});


test('overridden events from Ember Objects do not trigger', function(assert) {
  assert.expect(0);

  const Foo = Ember.Object.extend({
    @on('init')
    onInit() {
      // Do nothing...
    }
  });

  @evented
  class Bar extends Foo {
    onInit() {
      assert.ok(false, 'init event triggered when it should not have');
    }
  }

  Bar.create();
});

test('inherited events from ES Classes trigger', function(assert) {
  assert.expect(1);

  @evented
  class Foo extends Ember.Object {
    @on('init')
    onInit() {
      assert.ok(true, 'init event triggered correctly');
    }
  }

  class Bar extends Foo {}

  Bar.create();
});

test('overridden events from ES Classes do not trigger', function(assert) {
  assert.expect(0);

  const Foo = Ember.Object.extend({
    @on('init')
    onInit() {
    }
  });

  @evented
  class Bar extends Foo {
    onInit() {
      assert.ok(false, 'init event triggered when it should not have');
    }

    @on('init')
    onInitToo() {
      // Do nothing...
    }
  }

  class Baz extends Bar {
    onInitToo() {
      assert.ok(false, 'init event triggered when it should not have');
    }
  }

  Baz.create();
});
