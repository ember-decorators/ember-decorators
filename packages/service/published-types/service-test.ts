import Component from '@ember/component';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';

export class XFoo extends Component {
  @service('store') store!: Service;
  @service('router') router!: Service;
  @service('auth') auth!: Service; // $ExpectError
}
