import Ember from "ember";
import {
  attr,
  hasMany,
  belongsTo
} from "ember-computed-decorators/ember-data";

import { module, test, skip } from "qunit";

const { get, set } = Ember;

module('ember-data macro decorator');

test('DS macro', function(assert) {
  var Model = DS.Model.extend({
    /* jshint ignore:start */
    @attr firstName,
    @attr({ defaultTo: 'blue' }) lastName,
    @hasMany user,
    @belongsTo car
    /* jshint ignore:end*/
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
