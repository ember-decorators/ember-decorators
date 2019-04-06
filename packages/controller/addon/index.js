import { inject as injectController } from '@ember/controller';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';
import { gte } from 'ember-compatibility-helpers';

/**
  Decorator that injects a controller into a controller as the decorated
  property

  ```javascript
  import Controller from '@ember/controller';
  import { inject as controller } from '@ember-decorators/controller';

  export default class IndexController extends Controller {
    @controller application;
  }
  ```

  @function
  @param {string} controllerName? - The name of the controller to inject. If not provided, the property name will be used
  @return {Controller}
*/
export let inject;

if (gte('3.10.0')) {
  inject = computedDecoratorWithParams(
    injectController,
    'controller',
    "import { inject as controller } from '@ember/controller'"
  );
} else {
  inject = computedDecoratorWithParams(
    (desc, params) => {
      return injectController.apply(this, params);
    },
    'controller',
    "import { inject as controller } from '@ember/controller'"
  );
}
