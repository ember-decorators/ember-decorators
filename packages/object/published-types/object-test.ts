import EmberObject from '@ember/object';
import { observes, unobserves, on, off } from '@ember-decorators/object';

export class Foo {
  @observes('foo')
  bar() {
    console.log('foo changed');
  }

  @on('fooEvent', 'barEvent')
  baz() {
    console.log('an event was fired');
  }
}

export class Bar extends Foo {
  @unobserves('foo') barr!: any;
  @off('fooEvent', 'barEvent') bazz!: any;
}
