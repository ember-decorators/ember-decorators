import { module, test } from 'ember-qunit';

import { on, off } from '@ember-decorators/object';
import { sendEvent } from '@ember/object/events';

module('@off', function() {

  test('firing the event does not call the method', function(assert) {
    class Foo {
      @on('event', 'eventToo')
      onEvent() {
        assert.ok(false, 'method has been called');
      }
    }

    class Bar extends Foo {
      @off('event', 'eventToo') onEvent;
    }

    let obj = new Bar();
    sendEvent(obj, 'event');
    sendEvent(obj, 'eventToo');
    assert.ok(true, 'method has not been called');
  });

  test('it is possible to override the method', function(assert) {
    assert.expect(1);

    class Foo {
      @on('event')
      onEvent() {
        assert.ok(false, 'old method has been called');
      }
    }

    class Bar extends Foo {
      @off('event')
      onEvent() {
        assert.ok(true, 'new method has been called');
      }
    }

    let obj = new Bar();
    obj.onEvent();
  });

  test('throws if decorator params are not provided', function(assert) {
    assert.throws(
      () => {
        class Foo {
          @on('event', 'eventToo')
          onEvent() {

          }
        }

        class Bar extends Foo {
          @off
          onEvent() {
            assert.ok(false, 'method has been called');
          }
        }

        new Bar();
      },
      /The @off decorator requires parameters/,
    );
  });
});
