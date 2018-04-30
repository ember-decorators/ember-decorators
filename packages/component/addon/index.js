import { assert } from '@ember/debug';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';

/**
  Decorator which indicates that the field or computed should be bound
  to an attribute value on the component. This replaces `attributeBindings`
  by directly allowing you to specify which properties should be bound.

  ```js
  export default class AttributeDemoComponent extends Component {
    @attribute role = 'button';

    // With provided attribute name
    @attribute('data-foo') foo = 'lol';

    @attribute
    @computed
    get id() {
      // return generated id
    }
  }
  ```

  @function
  @param {string} name? - The name of the attribute to bind the value to if it is truthy
*/
export const attribute = decoratorWithParams(function(target, key, desc, params) {
  assert(`The @attribute decorator may take up to one parameter, the bound attribute name. Received: ${params.length}`, params.length <= 1);
  assert(`The @attribute decorator may only receive strings as parameters. Received: ${params}`, params.every(s => typeof s === 'string'));

  collapseProto(target);

  if (!target.hasOwnProperty('attributeBindings')) {
    let parentValue = target.attributeBindings;
    target.attributeBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
  }

  let binding = params[0] ? `${key}:${params[0]}` : key;

  target.attributeBindings.push(binding);

  if (desc) {
    // Decorated fields are currently not configurable in Babel for some reason, so ensure
    // that the field becomes configurable (else it messes with things)
    desc.configurable = true;
  }

  return desc;
});

/**
  Decorator which indicates that the field or computed should be bound to
  the component class names. This replaces `classNameBindings` by directly
  allowing you to specify which properties should be bound.

  ```js
  export default class ClassNameDemoComponent extends Component {
    @className boundField = 'default-class';

    // With provided true/false class names
    @className('active', 'inactive') isActive = true;

    @className
    @computed
    get boundComputed() {
      // return generated class
    }
  }
  ```

  @function
  @param {string} truthyName? - The class to be applied if the value the field
                                is truthy, defaults to the name of the field.
  @param {string} falsyName? - The class to be applied if the value of the field
                               is falsy.
*/
export const className = decoratorWithParams(function(target, key, desc, params) {
  assert(`The @className decorator may take up to two parameters, the truthy class and falsy class for the class binding. Received: ${params.length}`, params.length <= 2);
  assert(`The @className decorator may only receive strings as parameters. Received: ${params}`, params.every(s => typeof s === 'string'));

  collapseProto(target);

  if (!target.hasOwnProperty('classNameBindings')) {
    let parentValue = target.classNameBindings;
    target.classNameBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
  }

  let binding = params.length > 0 ? `${key}:${params.join(':')}` : key ;

  target.classNameBindings.push(binding);

  if (desc) {
    // Decorated fields are currently not configurable in Babel for some reason, so ensure
    // that the field becomes configurable (else it messes with things)
    desc.configurable = true;
  }

  return desc;
});

/**
  Class decorator which specifies the class names to be applied to a component.
  This replaces the `classNames` property on components in the traditional Ember
  object model.

  ```js
  @classNames('a-static-class', 'another-static-class')
  export default class ClassNamesDemoComponent extends Component {}
  ```

  @param {...string} classNames - The list of classes to be applied to the component
*/
export function classNames(...classNames) {
  assert(`The @classNames decorator must be provided strings, received: ${classNames}`, classNames.reduce((allStrings, name) => {
    return allStrings && typeof name === 'string'
  }, true));

  return function(klass) {
    let { prototype } = klass;

    collapseProto(prototype);

    if ('classNames' in prototype) {
      let parentClasses = prototype.classNames;
      classNames.unshift(...parentClasses);
    }

    prototype.classNames = classNames;

    return klass;
  }
}

/**
  Class decorator which specifies the tag name of the component. This replaces
  the `tagName` property on components in the traditional Ember object model.

  ```js
  @tagName('button')
  export default class TagNameDemoComponent extends Component {}
  ```

  @param {string} tagName - The HTML tag to be used for the component
*/
export function tagName(tagName) {
  assert(`The @tagName decorator must be provided exactly one argument, received: ${tagName}`, arguments.length === 1);
  assert(`The @tagName decorator must be provided a string, received: ${tagName}`, typeof tagName === 'string');

  return function(klass) {
    klass.prototype.tagName = tagName;
    return klass;
  }
}
