import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';

@tagName('span')
export class XFoo extends Component {}

// $ExpectError
@tagName
export class XFoo2 extends Component {}
