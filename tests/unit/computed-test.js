import Ember from 'ember';
import { computed, readOnly } from 'ember-decorators/object';
import { module, test } from 'qunit';

const { get, set, setProperties } = Ember;

module('computed properties');

test('passes dependent keys into function as arguments', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name(first, last) {
      assert.equal(first, 'rob');
      assert.equal(last, 'jackson');
    }
  };

  get(obj, 'name');
});

test('dependent key changes invalidate the computed property', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  };

  assert.equal(get(obj, 'name'), 'rob jackson');
  set(obj, 'first', 'al');
  assert.equal(get(obj, 'name'), 'al jackson');
});


test('readOnly', function(assert) {
  var obj = {
    first: 'rob',
    last: 'jackson',

    @readOnly
    @computed('first', 'last')
    name(first, last) {
      return `${first} ${last}`;
    }
  };

  assert.throws(
    () => {
      set(obj, 'name', 'al');
    },
    /Cannot set read-only property/,
    'error thrown correctly'
  );
});

test('only calls getter when dependent keys change', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    @computed('first', 'last')
    name() {
      callCount++;
    }
  };

  get(obj, 'name');
  assert.equal(callCount, 1);

  get(obj, 'name');
  assert.equal(callCount, 1);
});



test('works properly', function(assert) {
  let callCount = 0;
  let obj = {
    first: 'rob',
    last: 'jackson',

    /* jshint ignore:start */
    @computed
    /* jshint ignore:end */
    name() {
      callCount++;
    }
  };

  get(obj, 'name');

  assert.equal(callCount, 1);
});

test('works with es6 class', function(assert) {
  assert.expect(2);

  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    @computed('first', 'last')
    fullName(first, last) {
      assert.equal(first, 'rob');
      assert.equal(last, 'jackson');
    }
  }

  let obj = new Foo();
  get(obj, 'fullName');
});

test('works with es6 class getter', function(assert) {
  assert.expect(2);

  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    @computed('first', 'last')
    get fullName() {
      assert.equal(this.first, 'rob');
      assert.equal(this.last, 'jackson');
    }
  }

  let obj = new Foo();
  get(obj, 'fullName');
});

test('throws an assertion, if an ES6 setter was defined without an ES6 getter', function(assert) {
  assert.throws(
    () => {
      // eslint-disable-next-line
      class Foo {
        @computed
        set fullName(name) {}
      }
    },
    /Using @computed for only a setter does not make sense\. Add a getter for 'fullName' as well or remove the @computed decorator./,
    'error thrown correctly'
  );
});

test('works with es6 class getter and setter', function(assert) {
  assert.expect(6);

  let expectedName = 'rob jackson';
  let expectedFirst = 'rob';
  let expectedLast = 'jackson';

  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    @computed('first', 'last')
    get fullName() {
      assert.equal(this.first, expectedFirst, 'getter: first name matches');
      assert.equal(this.last, expectedLast, 'getter: last name matches');
      return `${this.first} ${this.last}`;
    }

    set fullName(name) {
      assert.equal(name, expectedName, 'setter: name matches');

      const [first, last] = name.split(' ');
      setProperties(this, { first, last });
    }
  }

  let obj = new Foo();
  get(obj, 'fullName');

  expectedName = 'yehuda katz';
  expectedFirst = 'yehuda';
  expectedLast = 'katz';
  set(obj, 'fullName', 'yehuda katz');

  assert.strictEqual(get(obj, 'fullName'), expectedName, 'return value of getter is new value of property');
});


test('return value of ES6 setter is not required, but is not ignored', function(assert) {
  class Foo {
    constructor() {
      this.first = 'rob';
      this.last = 'jackson';
    }

    @computed('first', 'last')
    get fullNameNoReturn() {
      return `${this.first} ${this.last}`;
    }

    set fullNameNoReturn(name) {
      const [first, last] = name.split(' ');
      setProperties(this, { first, last });
    }

    @computed('first', 'last')
    get fullNameWithReturn() {
      return `${this.first} ${this.last}`;
    }

    set fullNameWithReturn(name) {
      const [first, last] = name.split(' ');
      setProperties(this, { first, last });

      return 'something else';
    }
  }

  let obj = new Foo();

  set(obj, 'fullNameNoReturn', 'yehuda katz');
  assert.strictEqual(get(obj, 'fullNameNoReturn'), 'yehuda katz', 'return value of setter is not required, if there is a getter');


  set(obj, 'fullNameWithReturn', 'tom dale');
  assert.strictEqual(get(obj, 'fullNameWithReturn'), 'something else', 'if the setter returns a value, it is not ignored');
});

test('throws if the same property is decorated more than once', function(assert) {
  assert.throws(
    () => {
    // eslint-disable-next-line
      class Foo {
        @computed
        get fullName() {}

        @computed
        set fullName(name) {}
      }
    },
    /ES6 property getters\/setters only need to be decorated once, 'fullName' was decorated on both the getter and the setter/,
    'error thrown correctly'
  );
})
