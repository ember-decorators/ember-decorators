import DS from 'ember-data';
import {
  attr,
  hasMany,
  belongsTo
} from 'ember-computed-decorators/ember-data';

import { module, test } from 'qunit';

module('ember-data macro decorator');

test('DS macro', function(assert) {
  var Model = DS.Model.extend({
    @attr firstName: null,
    @attr({ defaultTo: 'blue' }) lastName: null,
    @hasMany user: null,
    @belongsTo car: null
  });

  Model.store = {
    modelFor(typeKey) {
      return typeKey;
    }
  };

  var attributes = [];
  Model.eachAttribute(function(attr) {
    attributes.push(attr);
  });

  assert.deepEqual(attributes, ['firstName', 'lastName']);

  var relationships = [];
  Model.eachRelationship(function(attr) {
    relationships.push(attr);
  });

  assert.deepEqual(relationships, ['user', 'car']);
});
