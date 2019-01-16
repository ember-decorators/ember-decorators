import EmberObject, { computed as emberComputed } from '@ember/object';
import { computed, observes, unobserves, on, off, action, wrapComputed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { test } from 'qunit';

export default class UserProfileComponent extends EmberObject {
  first = 'John';
  last = 'Smith';

  @computed
  get foo() {
    return 'bar';
  }

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

  @wrapComputed(emberComputed(() => {})) test: any;
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

  @(computed('first', 'last').readOnly())
  name(first: string, last: string) {
    return `${first} ${last}`;
  }

  @(computed('first', 'last').volatile())
  otherName(first: string, last: string) {
    return `${first} ${last}`;
  }

  @alias('name') nameAlias: string;
}

export class Bar extends Foo {
  @unobserves('foo') barr!: any;
  @off('fooEvent', 'barEvent') bazz!: any;
}

export const Baz = EmberObject.extend({
  first: 'John',
  last: 'Smith',

  name: computed('first', 'last', function() {
    const first = this.get('first');
    const last = this.get('last');

    return `${first} ${last}`; // => 'John Smith'
  }),

  nameAlias: alias('name')
});
