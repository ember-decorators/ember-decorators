import Ember from 'ember';

const {
  meta,
  addBeforeObserver,
  addListener,
  addObserver,
  removeBeforeObserver,
  removeObserver,
  removeListener
} = Ember;

function updateObserversAndListeners(obj, key, observerOrListener, pathsKey, updateMethod) {
  let paths = observerOrListener[pathsKey];

  if (paths) {
    for (let i = 0; i < paths.length; i++) {
      updateMethod(obj, paths[i], null, key);
    }
  }
}

export function replaceObservers(obj, key, observer, prevObserver) {
  if ('function' === typeof prevObserver) {
    updateObserversAndListeners(obj, key, prevObserver, '__ember_observesBefore__', removeBeforeObserver);
    updateObserversAndListeners(obj, key, prevObserver, '__ember_observes__', removeObserver);
  }

  if ('function' === typeof observer) {
    updateObserversAndListeners(obj, key, observer, '__ember_observesBefore__', addBeforeObserver);
    updateObserversAndListeners(obj, key, observer, '__ember_observes__', addObserver);
  }
}

export function replaceListeners(obj, key, listener, prevListener) {
  if ('function' === typeof prevListener) {
    updateObserversAndListeners(obj, key, prevListener, '__ember_listens__', removeListener);
  }

  if ('function' === typeof listener) {
    updateObserversAndListeners(obj, key, listener, '__ember_listens__', addListener);
  }
}

const replaceFunctionMap = {
  evented: replaceListeners,
  observer: replaceObservers
};

function applyProtoChain(name, proto, protoMeta) {
  let superclassProto = Object.getPrototypeOf(proto);

  if (superclassProto === null) return;

  let superclassProtoMeta = meta(superclassProto);

  if (!proto.hasOwnProperty('isObserverOrEventedRoot') && protoMeta[`${name}WasApplied`] !== true) {
    applyProtoChain(name, superclassProto, superclassProtoMeta);
    protoMeta.parent = superclassProtoMeta;
  }

  let keyNames = Object.getOwnPropertyNames(proto);

  for (let key of keyNames) {
    let observerOrListener = proto[key];
    let prevObserverOrListener = superclassProto[key];

    replaceFunctionMap[name](proto, key, observerOrListener, prevObserverOrListener);
  }

  protoMeta[`${name}WasApplied`] = true;
}

export function observerOrEventedDecorator(name) {
  return function(klass) {
    let oldInit = klass.prototype.init;

    klass.prototype.isObserverOrEventedRoot = true;

    klass.prototype.init = function() {
      let proto = Object.getPrototypeOf(this);
      let protoMeta = meta(proto);

      if (protoMeta[`${name}WasApplied`] !== true) {
        let instanceMeta = meta(this);
        instanceMeta.parent = protoMeta;

        applyProtoChain(name, proto, protoMeta);
      }

      if ('function' === typeof oldInit) {
        oldInit.apply(this, arguments);
      }
    }

    return klass;
  }
}
