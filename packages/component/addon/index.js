import { assert } from '@ember/debug';

import collapseProto from '@ember-decorators/utils/collapse-proto';
import {
  decoratorWithParams,
  decoratorWithRequiredParams,
} from '@ember-decorators/utils/decorator';

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
export const attribute = decoratorWithParams((desc, params = []) => {
  assert(
    `The @attribute decorator may take up to one parameter, the bound attribute name. Received: ${
      params.length
    }`,
    params.length <= 1
  );
  assert(
    `The @attribute decorator may only receive strings as parameters. Received: ${params}`,
    params.every(s => typeof s === 'string')
  );

  return {
    ...desc,
    finisher(target) {
      let { prototype } = target;
      let { key, descriptor } = desc;

      collapseProto(prototype);

      if (!prototype.hasOwnProperty('attributeBindings')) {
        let parentValue = prototype.attributeBindings;
        prototype.attributeBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
      }

      let binding = params[0] ? `${key}:${params[0]}` : key;

      prototype.attributeBindings.push(binding);

      if (descriptor) {
        // Decorated fields are currently not configurable in Babel for some reason, so ensure
        // that the field becomes configurable (else it messes with things)
        descriptor.configurable = true;
      }

      return target;
    },
  };
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
export const className = decoratorWithParams((desc, params = []) => {
  assert(
    `The @className decorator may take up to two parameters, the truthy class and falsy class for the class binding. Received: ${
      params.length
    }`,
    params.length <= 2
  );
  assert(
    `The @className decorator may only receive strings as parameters. Received: ${params}`,
    params.every(s => typeof s === 'string')
  );

  return {
    ...desc,
    finisher(target) {
      let { prototype } = target;
      let { key, descriptor } = desc;

      collapseProto(prototype);

      if (!prototype.hasOwnProperty('classNameBindings')) {
        let parentValue = prototype.classNameBindings;
        prototype.classNameBindings = Array.isArray(parentValue) ? parentValue.slice() : [];
      }

      let binding = params.length > 0 ? `${key}:${params.join(':')}` : key;

      prototype.classNameBindings.push(binding);

      if (descriptor) {
        // Decorated fields are currently not configurable in Babel for some reason, so ensure
        // that the field becomes configurable (else it messes with things)
        descriptor.configurable = true;
      }

      return target;
    },
  };
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
export const classNames = decoratorWithRequiredParams((desc, classNames) => {
  assert(
    `The @classNames decorator must be provided strings, received: ${classNames}`,
    classNames.reduce((allStrings, name) => allStrings && typeof name === 'string', true)
  );

  return {
    ...desc,
    finisher(target) {
      let { prototype } = target;

      collapseProto(prototype);

      if ('classNames' in prototype) {
        let parentClasses = prototype.classNames;
        classNames.unshift(...parentClasses);
      }

      prototype.classNames = classNames;

      return target;
    },
  };
}, 'classNames');

/**
  Class decorator which specifies the tag name of the component. This replaces
  the `tagName` property on components in the traditional Ember object model.

  ```js
  @tagName('button')
  export default class TagNameDemoComponent extends Component {}
  ```

  @param {string} tagName - The HTML tag to be used for the component
*/
export const tagName = decoratorWithRequiredParams((desc, params) => {
  let [tagName] = params;

  assert(
    `The @tagName decorator must be provided exactly one argument, received: ${tagName}`,
    params.length === 1
  );
  assert(
    `The @tagName decorator must be provided a string, received: ${tagName}`,
    typeof tagName === 'string'
  );

  return {
    ...desc,
    finisher(target) {
      target.prototype.tagName = tagName;
      return target;
    },
  };
}, 'tagName');

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
export const layout = decoratorWithRequiredParams((desc, params) => {
  let [template] = params;

  assert(
    `The @layout decorator must be provided exactly one argument, received: ${params.length}`,
    params.length === 1
  );
  assert(
    `The @layout decorator must be provided a template, received: ${template}. If you want to compile strings to templates, be sure to use 'htmlbars-inline-precompile'`,
    typeof template !== 'string'
  );
  assert(
    `The @layout decorator must be provided a template, received: ${template}`,
    (() => typeof template === 'object' && typeof template.indexOf === 'undefined')()
  );

  return {
    ...desc,
    finisher(target) {
      target.prototype.layout = template;
      return target;
    },
  };
}, 'layout');
