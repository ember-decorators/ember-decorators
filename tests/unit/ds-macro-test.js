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