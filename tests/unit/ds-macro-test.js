import DS from 'ember-data';
import {
  attr,
  hasMany,
  belongsTo
} from 'ember-decorators/data';

import { module, test } from 'qunit';

module('ember-data macro decorator');

test('DS macro', function(assert) {
  var Model = DS.Model.extend({
    @attr firstName: null,
    @attr({ defaultTo: 'blue' }) lastName: null,
    @attr('number') age: null,
    @hasMany user: null,
    @belongsTo car: null
  });

  Model.store = {
    modelFor(typeKey) {
      return typeKey;
    }
  };

  var attributes = [];
  Model.eachAttribute(function(attr, meta) {
    attributes.push({name: attr, type: meta.type});
  });

  assert.deepEqual(attributes, [
    {name: 'firstName', type: undefined},
    {name: 'lastName',  type: undefined},
    {name: 'age',       type: 'number'}
  ]);

  var relationships = [];
  Model.eachRelationship(function(attr) {
    relationships.push(attr);
  });

  assert.deepEqual(relationships, ['user', 'car']);
});
