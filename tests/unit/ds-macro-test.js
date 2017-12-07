import Model from 'ember-data/model';
import {
  attr,
  hasMany,
  belongsTo
} from 'ember-decorators/data';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import { createStore } from '../helpers/store'; 

import { module, test } from 'qunit';

module('ember-data macro decorator');

test('DS macro', function(assert) {
  let ObjectModel = Model.extend({
    @attr firstName: null,
    @attr({ defaultTo: 'blue' }) lastName: null,
    @attr('number') age: null,
    @hasMany users: null,
    @belongsTo car: null
  });

  let attributes = [];
  ObjectModel.eachAttribute((attr, meta) => {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'firstName', type: undefined},
    {name: 'lastName',  type: undefined},
    {name: 'age',       type: 'number'}
  ]);

  let relationships = [];
  ObjectModel.eachRelationship((attr, meta) => {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'users', type: 'user'},
    {key: 'car', type: 'car'}
  ]);
});

test('DS macro with User class', function(assert) {
  class User extends Model {
    @attr firstName;
    @attr({ defaultTo: 'blue' }) lastName;
    @attr('number') age;
    @hasMany cars;
    @belongsTo parent;
  }

  let attributes = [];
  User.eachAttribute((attr, meta) => {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'firstName', type: undefined},
    {name: 'lastName',  type: undefined},
    {name: 'age',       type: 'number'}
  ], 'user attributes are correct');

  let relationships = [];
  User.eachRelationship((attr, meta) => {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'cars', type: 'car'},
    {key: 'parent', type: 'parent'}
  ]);
});

test('User class with dasherized type', function(assert) {
  class MyUser extends Model {
    @hasMany blogPosts;
  }

  let relationships = [];
  MyUser.eachRelationship((attr, meta) => {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'blogPosts', type: 'blog-post'}
  ]);
});

test('User class with a different type', function(assert) {
  class MyUser extends Model {
    @hasMany('blogger') blogPosts;
  }

  let relationships = [];
  MyUser.eachRelationship((attr, meta) => {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'blogPosts', type: 'blogger'}
  ]);
});

test('DS macro with multiple classes', function(assert) {
  class Car extends Model {
    @attr('boolean') electric;
  }

  class User extends Model {
    @attr name;
    @attr('number') age;
    @hasMany cars;
  }

  let attributes = [];
  Car.eachAttribute((attr, meta) => {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'electric', type: 'boolean'},
  ], 'Car attributes are correct');

  let user_attributes = [];
  User.eachAttribute((attr, meta) => {
    user_attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(user_attributes, [
    {name: 'name', type: undefined},
    {name: 'age',  type: 'number'}
  ], 'User attributes are correct');

  let user_relationships = [];
  User.eachRelationship((attr, meta) => {
    user_relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(user_relationships, [
    {key: 'cars', type: 'car'}
  ], 'User relationships are correct');
});

test('can find records in store', function(assert) {
  class Tag extends Model {
    @attr name;
    @hasMany users;
  }

  class User extends Model {
    @attr name;
    @belongsTo tag;
  }

  let store = createStore({ tag: Tag, user: User });

  run(() => {
    store.push({
      data: [{
        type: 'tag',
        id: '5',
        attributes: {
          name: 'friendly'
        }
      }, {
        type: 'user',
        id: '1',
        attributes: {
          name: 'Tom Dale'
        },
        relationships: {
          // tag: {
          //   data: { type: 'tag', id: '5' }
          // }
        }
      }]
    });
  });

  return run(() => {
    const tag = store.peekRecord('tag', 5);
    assert.equal(get(tag, 'name'), 'friendly', 'retrieves tag record from store');
    const user = store.peekRecord('user', 1);
    assert.equal(get(user, 'name'), 'Tom Dale', 'retrieves user record from store');
    // assert.equal(get(user, 'tag') instanceof Tag, true, 'the tag property should return a tag');
    // assert.equal(get(user, 'tag.name'), 'friendly', 'the tag shuld have name');
  });
});