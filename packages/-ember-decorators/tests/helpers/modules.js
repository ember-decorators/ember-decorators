import { moduleForComponent } from 'ember-qunit';

export function componentModule(...params) {
  let callback = params.pop();

  moduleForComponent(...params, { integration: true });

  callback();
}
