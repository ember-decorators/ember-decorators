import FooComponent from './foo-component';
import { attribute } from '@ember-decorators/component';

export default class BarComponent extends FooComponent {
  @attribute id = 'bar';
}
