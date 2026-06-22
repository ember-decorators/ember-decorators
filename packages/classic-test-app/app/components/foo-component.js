// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component';
import { attribute } from '@ember-decorators/component';

// eslint-disable-next-line ember/require-tagless-components
export default class FooComponent extends Component {
  @attribute role = 'button';
}
