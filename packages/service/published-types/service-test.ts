import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import Service from '@ember/service';

export class XFoo extends Component {
  @service('store') store!: Service;
  @service('router') router!: Service;
  @service('auth') auth!: Service; // $ExpectError
}

export const XBar = Component.extend({
  store: service('store'),
  router: service('router'),
  auth: service('auth'), // $ExpectError
})
