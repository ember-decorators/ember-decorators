import Component from '@ember/component';
import { attribute } from '@ember-decorators/component';

export default class FooComponent extends Component {
  @attribute role = 'button';
}
