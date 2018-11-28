import Controller from '@ember/controller';
import { controller } from '@ember-decorators/controller';

declare module '@ember/controller' {
  interface Registry {
    ['x-bar']: Controller;
  }
}

export class XFoo extends Controller {
  @controller('x-bar') barController!: Controller;
  // $ExpectError
  @controller('x-baz') bazController!: Controller;
}
