import { computed as emberComputed } from '@ember/object';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

let computed;

if (SUPPORTS_NEW_COMPUTED) {
  computed = emberComputed;
} else {
  computed = function(...params) {
    let desc = params.pop();

    if (typeof desc === 'function') {
      return emberComputed(...params, desc);
    } else if ('set' in desc) {
      const { get, set } = desc;

      return emberComputed(...params, function (key, value) {
        if (arguments.length > 1) {
          return set.call(this, key, value);
        }

        return get.call(this);
      });
    } else {
      return emberComputed(...params, desc.get);
    }
  };
}

export { computed };
