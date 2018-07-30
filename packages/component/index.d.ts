import { TemplateFactory } from 'htmlbars-inline-precompile';

/**
 * Decorator which indicates that the field or computed should be bound
 * to an attribute value on the component. This replaces `attributeBindings`
 * by directly allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { attribute } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class AttributeDemoComponent extends Component {
 *   @attribute role = 'button';
 *
 *   // With provided attribute name
 *   @attribute('data-foo') foo = 'lol';
 *
 *   @attribute
 *   @computed
 *   get id() {
 *     // return generated id
 *   }
 * }
 * ```
 *
 * @function
 */
export function attribute(name?: string): PropertyDecorator;
/**
 * Decorator which indicates that the field or computed should be bound
 * to an attribute value on the component. This replaces `attributeBindings`
 * by directly allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { attribute } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class AttributeDemoComponent extends Component {
 *   @attribute role = 'button';
 *
 *   // With provided attribute name
 *   @attribute('data-foo') foo = 'lol';
 *
 *   @attribute
 *   @computed
 *   get id() {
 *     // return generated id
 *   }
 * }
 * ```
 *
 * @function
 */
export function attribute(
  target: any,
  key: any,
  descriptor: PropertyDescriptor
): PropertyDescriptor;
/**
 * Decorator which indicates that the field or computed should be bound
 * to an attribute value on the component. This replaces `attributeBindings`
 * by directly allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { attribute } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class AttributeDemoComponent extends Component {
 *   @attribute role = 'button';
 *
 *   // With provided attribute name
 *   @attribute('data-foo') foo = 'lol';
 *
 *   @attribute
 *   @computed
 *   get id() {
 *     // return generated id
 *   }
 * }
 * ```
 *
 * @function
 */
export function attribute(target: any, key: any): any;

/**
 * Decorator which indicates that the field or computed should be bound to
 * the component class names. This replaces `classNameBindings` by directly
 * allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { className } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class ClassNameDemoComponent extends Component {
 *   @className boundField = 'default-class';
 *
 *   // With provided true/false class names
 *   @className('active', 'inactive') isActive = true;
 *
 *   @className
 *   @computed
 *   get boundComputed() {
 *     // return generated class
 *   }
 * }
 * ```
 *
 * @function
 */
export function className(target: any, key: any): any;
/**
 * Decorator which indicates that the field or computed should be bound to
 * the component class names. This replaces `classNameBindings` by directly
 * allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { className } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class ClassNameDemoComponent extends Component {
 *   @className boundField = 'default-class';
 *
 *   // With provided true/false class names
 *   @className('active', 'inactive') isActive = true;
 *
 *   @className
 *   @computed
 *   get boundComputed() {
 *     // return generated class
 *   }
 * }
 * ```
 *
 * @function
 */
export function className(
  target: any,
  key: any,
  descriptor: PropertyDescriptor
): PropertyDescriptor;
/**
 * Decorator which indicates that the field or computed should be bound to
 * the component class names. This replaces `classNameBindings` by directly
 * allowing you to specify which properties should be bound.
 *
 * ```js
 * import Component from '@ember/component';
 * import { className } from 'ember-decorators/component';
 * import { computed } from 'ember-decorators/object';
 *
 * export default class ClassNameDemoComponent extends Component {
 *   @className boundField = 'default-class';
 *
 *   // With provided true/false class names
 *   @className('active', 'inactive') isActive = true;
 *
 *   @className
 *   @computed
 *   get boundComputed() {
 *     // return generated class
 *   }
 * }
 * ```
 *
 * @function
 */
export function className(
  trueValue?: string,
  falseValue?: string
): PropertyDecorator;

/**
 * Class decorator which specifies the class names to be applied to a component.
 * This replaces the `classNames` property on components in the traditional Ember
 * object model.
 *
 * ```js
 * import Component from '@ember/component';
 * import { classNames } from 'ember-decorators/component';
 *
 * @classNames('a-static-class', 'another-static-class')
 * export default class ClassNamesDemoComponent extends Component {}
 * ```
 *
 * @param {...String} classNames - The list of classes to be applied to the component
 */
export function classNames(...classNames: string[]): ClassDecorator;

/**
 * Class decorator which specifies the tag name of the component. This replaces
 * the `tagName` property on components in the traditional Ember object model.
 *
 * ```js
 * import Component from '@ember/component';
 * import { tagName } from 'ember-decorators/component';
 *
 * @tagName('button')
 * export default class TagNameDemoComponent extends Component {}
 * ```
 *
 * @param {String} tagName - The HTML tag to be used for the component
 */
export function tagName(tagName: string): ClassDecorator;

/**
  Class decorator which specifies the layout for the component. This replaces
  the `layout` property on components in the traditional Ember object model.

  ```js
  import template from '../templates/components/x-foo';

  @layout(template)
  export default class TagNameDemoComponent extends Component {}
  ```

  ```js
  import hbs from 'htmlbars-inline-precompile';

  @layout(hbs`<h1>Hello {{ name }}</h1>`)
  export default class TagNameDemoComponent extends Component {
    constructor() {
      super(...arguments);
      this.set('name', 'Tomster');
    }
  }
  ```

  @param {TemplateFactory} template - The compiled template to be used for the component
*/
export function layout(template: TemplateFactory): ClassDecorator;
