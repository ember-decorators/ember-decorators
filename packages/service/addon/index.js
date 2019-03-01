import { inject as injectService } from '@ember/service';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';
import { gte } from 'ember-compatibility-helpers';

/**
  Decorator that injects a service into the object as the decorated property

   ```javascript
  import Component from '@ember/component';
  import { inject as service } from '@ember-decorators/service';

  export default class StoreInjectedComponent extends Component {
    @service store;
  }
  ```

  @function
  @param {string} serviceName? - The name of the service to inject. If not provided, the property name will be used
  @return {Service}
*/
export let inject;

if (gte('3.10.0')) {
  inject = computedDecoratorWithParams(injectService);
} else {
  inject = computedDecoratorWithParams((desc, params) => {
    return injectService.apply(this, params);
  });
}
