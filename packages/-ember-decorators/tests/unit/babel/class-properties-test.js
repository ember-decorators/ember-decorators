import { module, test } from 'qunit';

module('Babel | class properties', function() {
  test('it works', function(assert) {
    // https://github.com/babel/babel/tree/6.x/packages/babel-plugin-transform-class-properties
    class Bork {
      //Property initializer syntax
      instanceProperty = 'bork';
      boundFunction = () => {
        return this.instanceProperty;
      };

      //Static class properties
      static staticProperty = 'babelIsCool';
      static staticFunction = function() {
        return Bork.staticProperty;
      };
    }

    const myBork = new Bork();

    assert.strictEqual(
      myBork.__proto__.boundFunction,
      undefined,
      'Property initializers are not on the prototype.'
    );
    assert.strictEqual(
      myBork.boundFunction.call(undefined),
      'bork',
      'Bound functions are bound to the class instance.'
    );
    assert.strictEqual(
      Bork.staticFunction(),
      'babelIsCool',
      'Static function exists on the class.'
    );
  });
});
