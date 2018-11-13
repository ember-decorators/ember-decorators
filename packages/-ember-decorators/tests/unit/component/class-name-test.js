import Component from '@ember/component';
import { className } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';
import { find, findAll } from 'ember-native-dom-helpers';

moduleForComponent('@className', { integration: true });

test('decorator adds class to component', function(assert) {
  class FooComponent extends Component {
    @className foo = 'foo';

    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('.foo'));
  assert.ok(find('.bar'));
});

test('decorator applies true/false class names', function(assert) {
  class FooComponent extends Component {
    @className('is-foo') foo = true;
    @className('', 'is-not-bar') bar = false;
    @className('', 'inactive') active = true;
    @className('is-baz') baz = false;
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.render(hbs`{{foo-component}}`);

  assert.ok(find('.is-foo'));
  assert.ok(find('.is-not-bar'));
  assert.notOk(find('.inactive'));
  assert.notOk(find('.is-baz'));
});

test('decorator throws on incorrect parameter usage', function(assert) {
  assert.throws(() => {
    class Foo extends Object {
      @className('is-foo', 'is-bar', 'is-baz') foo = true;
    }

    Foo.create();
  }, /The @className decorator may take up to two parameters/);

  assert.throws(() => {
    class Foo extends Object {
      @className('is-foo', 123) foo = true;
    }

    Foo.create();
  }, /The @className decorator may only receive strings as parameters/);
});

test('decorator does not add class to superclass', function(assert) {
  class FooComponent extends Component {
    @className foo = 'foo';
  }

  class BarComponent extends FooComponent {
    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});

test('decorator works correctly through traditional and ES6 hierarchy', function(assert) {
  const FooComponent = Component.extend({
    classNameBindings: ['foo'],
    foo: 'foo'
  });

  class BarComponent extends FooComponent {
    @className
    @computed
    get bar() {
      return 'bar';
    }
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`Hello, world!`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`Hello, moon!`);

  this.render(hbs`{{foo-component}}{{bar-component}}`)

  assert.equal(findAll('.foo').length, 2);
  assert.equal(findAll('.bar').length, 1);
});
