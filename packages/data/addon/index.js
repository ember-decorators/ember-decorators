import DS from 'ember-data';
import { computedDecoratorWithParams } from '@ember-decorators/utils/computed';

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
export const attr = computedDecoratorWithParams((desc, params) => DS.attr.apply(this, params));

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
export const hasMany = computedDecoratorWithParams((desc, params) => DS.hasMany.apply(this, params));

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
export const belongsTo = computedDecoratorWithParams((desc, params) => DS.belongsTo.apply(this, params));
