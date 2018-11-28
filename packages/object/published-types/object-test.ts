import EmbrerObject from '@ember/object';
import { computed } from '@ember-decorators/object';

class MyModel1 extends EmbrerObject {
  firstName!: string;
  lastName!: string;

  @computed('firstName', 'lastName')
  get fullName(): string {
    return [this.firstName, this.lastName].join(' ');
  }
}
