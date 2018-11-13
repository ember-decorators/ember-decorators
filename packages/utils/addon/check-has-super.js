const fnToString = Function.prototype.toString;

const checkHasSuper = (() => {
  let sourceAvailable =
    fnToString
      .call(function() {
        return this;
      })
      .indexOf('return this') > -1;

  if (sourceAvailable) {
    // checks for a call to super _with_ the specified key. Also checks for
    // transpiled calls to super, matching against access to prototype and the
    // key on the same line within the function. This process is a bit fuzzy, so
    // we should keep an eye on it.
    return function checkHasSuper(func, key) {
      let superPattern = new RegExp(`(^|[^\\w.])super\\.${key}|\\.prototype['"),.\\s]*${key}`);
      return superPattern.test(fnToString.call(func));
    };
  }

  return function checkHasSuper() {
    return true;
  };
})();

export default checkHasSuper;
