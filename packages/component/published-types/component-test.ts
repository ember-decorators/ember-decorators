import Component from '@ember/component';
import {
  tagName,
  attribute,
  className,
  classNames,
  classNameBindings,
  attributeBindings,
  layout,
} from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';

@tagName('span')
export class XFoo extends Component {}

// $ExpectError
@tagName
export class XFoo2 extends Component {}

@attributeBindings('foo', 'bar')
export class AttributeDemoComponent extends Component {
  @attribute role = 'button';

  // With provided attribute name
  @attribute('data-foo') foo = 'lol';

  @attribute
  get id() {
    return `${Math.random()}`;
  }
}

// $ExpectError
@attributeBindings
export class AttributeDemoComponent2 extends Component { }

@classNameBindings('foo', 'bar')
export class ClassNameDemoComponent extends Component {
  @className boundField = 'default-class';

  // With provided true/false class names
  @className('active', 'inactive') isActive = true;

  @className
  get boundComputed() {
    return 'btn-primary';
  }
}

// $ExpectError
@classNameBindings
export class ClassNameDemoComponent2 extends Component { }

@classNames('a-static-class', 'another-static-class')
export class ClassNamesDemoComponent1 extends Component {}

// $ExpectError
@classNames
export class ClassNamesDemoComponent2 extends Component {}

@layout(hbs`<h1> Hello {{name}} </h1>`)
export class LayoutDemoComponent1 extends Component {}

// $ExpectError
@layout()
export class LayoutDemoComponent2 extends Component {}

// $ExpectError
@layout
export class LayoutDemoComponent3 extends Component {}
