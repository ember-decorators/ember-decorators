import { computed, observes, unobserves, on, off, action, readOnly, volatile } from '@ember-decorators/object';
import EmberObject from '@ember/object';

export default class UserProfileComponent extends EmberObject {
  first = 'John';
  last = 'Smith';

  @computed('first', 'last')
  get name() {
    const first = this.get('first');
    const last = this.get('last');

    return `${first} ${last}`; // => 'John Smith'
  }

  set name(value: string) {
    if (typeof value !== 'string' || !/^[a-z]+ [a-z]+$/i.test(value)) {
      throw new TypeError('Invalid name');
    }

    const [first, last] = value.split(' ');
    this.setProperties({ first, last });
  }
}

export class Foo {
  @observes('foo')
  bar() {
    console.log('foo changed');
  }

  @on('fooEvent', 'barEvent')
  baz() {
    console.log('an event was fired')
  }
  @action
  onClick() {
    // do something
  }

  @readOnly
  @computed('first', 'last')
  name(first: string, last: string) {
    return `${first} ${last}`;
  }

  @volatile
  @computed('first', 'last')
  otherName(first: string, last: string) {
    return `${first} ${last}`;
  }
}

export class Bar extends Foo {
  @unobserves('foo') barr!: any;
  @off('fooEvent', 'barEvent') bazz!: any;
}
