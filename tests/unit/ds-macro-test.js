import Model from 'ember-data/model';
import {
  attr,
  hasMany,
  belongsTo
} from 'ember-decorators/data';

import { module, test } from 'qunit';

module('ember-data macro decorator');

test('DS macro', function(assert) {
  let ObjectModel = Model.extend({
    @attr firstName: null,
    @attr({ defaultTo: 'blue' }) lastName: null,
    @attr('number') age: null,
    @hasMany user: null,
    @belongsTo car: null
  });

  ObjectModel.store = {
    modelFor(typeKey) {
      return typeKey;
    }
  };

  let attributes = [];
  ObjectModel.eachAttribute(function(attr, meta) {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'firstName', type: undefined},
    {name: 'lastName',  type: undefined},
    {name: 'age',       type: 'number'}
  ]);

  let relationships = [];
  ObjectModel.eachRelationship(function(attr) {
    relationships.push(attr);
  });

  assert.deepEqual(relationships, ['user', 'car']);
});

test('DS macro with ES6 class', function(assert) {
  class ES6 extends Model {
    @attr firstName;
    @attr({ defaultTo: 'blue' }) lastName;
    @attr('number') age;
    @hasMany('user') users;
    @belongsTo car;
  }

  ES6.store = {
    modelFor(typeKey) {
      return typeKey;
    }
  };

  let attributes = [];
  ES6.eachAttribute(function(attr, meta) {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'firstName', type: undefined},
    {name: 'lastName',  type: undefined},
    {name: 'age',       type: 'number'}
  ]);

  let relationships = [];
  ES6.eachRelationship(function(attr, meta) {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'users', type: 'user'},
    {key: 'car', type: 'car'}
  ]);
});

test('DS macro with multiple ES6 classes', function(assert) {
  class Storefront extends Model {
    @attr address;
    @hasMany('user') users;
    @belongsTo car;
  }

  class User extends Model {
    @attr name;
    @attr('number') age;
    @hasMany('storefront') storefronts;
  }

  // Storefront
  let attributes = [];
  Storefront.eachAttribute(function(attr, meta) {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'address', type: undefined},
  ]);

  let relationships = [];
  Storefront.eachRelationship(function(attr, meta) {
    relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(relationships, [
    {key: 'users', type: 'user'},
    {key: 'car', type: 'car'}
  ]);

  // User
  let user_attributes = [];
  User.eachAttribute(function(attr, meta) {
    user_attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(user_attributes, [
    {name: 'name', type: undefined},
    {name: 'age',  type: 'number'}
  ]);

  let user_relationships = [];
  User.eachRelationship(function(attr, meta) {
    user_relationships.push({key: attr, type: meta.type});
  });

  assert.deepEqual(user_relationships, [
    {key: 'storefronts', type: 'storefront'}
  ]);
});