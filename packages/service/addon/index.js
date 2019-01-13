import { inject as injectService } from '@ember/service';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

/**
  Decorator that injects a service into the object as the decorated property

   ```javascript
  import Component from '@ember/component';
  import { inject as service } from '@ember-decorators/service';

  export default class StoreInjectedComponent extends Component
    @service store;
  }
  ```

  @function
  @param {string} serviceName? - The name of the service to inject. If not provided, the property name will be used
  @return {Service}
*/
export const inject = computedDecoratorWithParams((desc, params) => {
  return injectService.apply(this, params);
});
