import Controller from '@ember/controller';
import { inject as controller } from '@ember-decorators/controller';

declare module '@ember/controller' {
  interface Registry {
    ['x-foo']: Controller;
    ['x-bar']: Controller;
    bazController: Controller;
  }
}

export class XFoo extends Controller {
  @controller('x-bar') barController!: Controller;
  @controller bazController!: Controller;
  // $ExpectError
  @controller('x-baz') bazController!: Controller;
}

export const XBar = Controller.extend({
  barController: controller('x-bar'),
  // $ExpectError
  bazController: controller('x-baz'),
})
