
import Ember from "ember";
import {
  alias,
  and,
  bool,
  collect,
  empty,
  equal,
  filter,
  filterBy,
  gt,
  gte,
  lt,
  lte,
  map,
  mapBy,
  match,
  max,
  min,
  none,
  not,
  notEmpty,
  oneWay,
  or,
  readOnly,
  reads,
  setDiff,
  sort,
  sum,
  union,
  uniq
} from "ember-computed-decorators";
import { module, test, skip } from "qunit";

const { get, set } = Ember;

module('macro decorator');

test('alias', function(assert) {
  var didInit = false;

  var obj = Ember.Object.extend({
    init() {
      this._super(...arguments);
      this.first = 'rob';
      this.last = 'jackson';
    },

    /* jshint ignore:start */
    @alias('first') firstName,
    @empty('first') hasNoFirstName,
    @notEmpty('first') hasFirstName,
    @none('first') hasNoneFirstName,
    @not('first') notFirstName,
    @bool('first') boolFirstName,
    @match('first', /rob/) firstNameMatch,
    @equal('first', 'rob') firstNameEqual,
    // @gt()
    // @gte
    // @lt
    // @lte
    // @and
    // @or
    // @any
    // @oneWay
    /* jshint ignore:end */
    name() {
      didInit = true;
    }
  }).create();

  assert.equal(obj.get('firstName'), 'rob');
  assert.equal(obj.get('hasNoFirstName'), false);
  assert.equal(obj.get('hasFirstName'), true);
  assert.equal(obj.get('hasNoneFirstName'), false);
  assert.equal(obj.get('notFirstName'), false);
  assert.equal(obj.get('boolFirstName'), true);
  assert.equal(obj.get('firstNameMatch'), true);
  assert.equal(obj.get('firstNameEqual'), true);

});
