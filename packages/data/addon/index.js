import DS from 'ember-data';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

function computedDecoratorWithKeyReflection(fn) {
  return computedDecoratorWithParams(function(target, keyName, desc, params) {
    let key;

    if (typeof params[0] === 'string') {
      key = params.shift();
    } else {
      key = keyName;
    }

    return fn(key, ...params)
  });
}


/**
  Decorator that turns the property into an Ember Data attribute

  ```js
  export default class User extends Model {
    @attr firstName;

    @attr('string') lastName;

    @attr('number', { defaultValue: 0 })
    age;
  }
  ```

  @function
  @param {string} type? - Type of the attribute
  @param {object} options? - Options for the attribute
*/
export const attr = computedDecoratorWithParams(function(target, key, desc, params) {
  return DS.attr(...params);
});

/**
  Decorator that turns the property into an Ember Data `hasMany` relationship

  ```js
  export default class User extends Model {
    @hasMany posts;

    @hasMany('user') friends;

    @hasMany('user', { async: false })
    followers;
  }
  ```

  @function
  @param {string} type? - Type of relationship
  @param {object} options? - Options for the relationship
*/
export const hasMany = computedDecoratorWithKeyReflection(DS.hasMany);

/**
  Decorator that turns the property into an Ember Data `belongsTo` relationship

  ```javascript
  export default class Post extends Model {
    @belongsTo user;

    @belongsTo('user') editor

    @belongsTo('post', { async: false })
    parentPost;
  }
  ```
  @function
  @param {string} type? - Type of the relationship
  @param {object} options? - Type of the relationship
*/
export const belongsTo = computedDecoratorWithKeyReflection(DS.belongsTo);
