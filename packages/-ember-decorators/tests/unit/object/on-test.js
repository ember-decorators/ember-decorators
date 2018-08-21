import { module, test } from 'ember-qunit';

import { on } from '@ember-decorators/object';
import { sendEvent } from '@ember/object/events';

module('javascript | @on', function() {

  test('it calls the method', function(assert) {
    assert.expect(2);

    class Foo {
      @on('first', 'second')
      onEvent() {
        assert.ok(true, 'method has called');
      }
    }

    let obj = new Foo();
    sendEvent(obj, 'first');
    sendEvent(obj, 'second');
  });

  test('arguments have been provided', function(assert) {
    const expected = {hello: 'world'};

    assert.expect(1);

    class Foo {
      @on('event')
      onEvent(arg) {
        assert.deepEqual(arg, expected, 'argument have been provided');
      }
    }

    let obj = new Foo();
    sendEvent(obj, 'event', [expected]);
  });

  test('it calls the method only when subscribed event is fired', function(assert) {
    assert.expect(4);

    let callCount = 0;

    class Foo {
      @on('event', 'eventToo')
      onEvent() {
        ++callCount;
      }
    }

    let obj = new Foo();
    assert.equal(callCount, 0);
    sendEvent(obj, 'event');
    assert.equal(callCount, 1);
    sendEvent(obj, 'anotherEvent');
    assert.equal(callCount, 1);
    sendEvent(obj, 'eventToo');
    assert.equal(callCount, 2);
  });

  test('throws if used on non-function', function(assert) {
    assert.throws(
      () => {
        class Foo {
          @on('event')
          fullName = 'rob jackson';
        }

        new Foo();
      },
      /The @on decorator must be applied to functions/,
      'throws on field'
    );

    assert.throws(
      () => {
        class Foo {
          @on('event')
          get fullName() {
            assert.ok(false, 'getter has been called');
            return 'rob jackson';
          }
        }

        new Foo();
      },
      /The @on decorator must be applied to functions/,
      'throws on getter'
    );

    assert.throws(
      () => {
        class Foo {
          @on('event')
          set fullName(value) {
            assert.ok(false, `setter has been called (value: ${value}`);
          }
        }

        new Foo();
      },
      /The @on decorator must be applied to functions/,
      'throws on setter'
    );
  });

  test('throws if decorator params are not provided', function(assert) {
    assert.throws(
      () => {
        class Foo {
          @on
          onEvent() {
            assert.ok(false, 'method has been called');
          }
        }

        new Foo();
      },
      /Cannot decorate member 'onEvent' without parameters/
    );
  })
});
