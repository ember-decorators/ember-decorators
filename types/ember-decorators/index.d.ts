// Type definitions for ember-decorators 1.2
// Project: https://github.com/rwjblue/ember-decorators#readme
// Definitions by: My Self <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import Ember from 'ember';

declare module "@ember/application" {
    export class Application extends Ember.Application { }
    export const getOwner: typeof Ember.getOwner;
    export const onLoad: typeof Ember.onLoad;
    export const runLoadHooks: typeof Ember.runLoadHooks;
    export const setOwner: typeof Ember.setOwner;
}

declare module "@ember/application/deprecations" {
    export const deprecate: typeof Ember.deprecate;
    export const deprecateFunc: typeof Ember.deprecateFunc;
}

declare module "@ember/application/globals-resolver" {
    export class GlobalsResolver extends Ember.DefaultResolver { }
}

declare module "@ember/application/instance" {
    export class ApplicationInstance extends Ember.ApplicationInstance { }
}

declare module "@ember/application/resolver" {
    export class Resolver extends Ember.Resolver { }
}

declare module "@ember/array" {
    export class EmberArray extends Ember.Array { }
    export const A: typeof Ember.A;
    export const isArray: typeof Ember.isArray;
    export const makeArray: typeof Ember.makeArray;
}

declare module "@ember/array/mutable" {
    export class MutableArray extends Ember.MutableArray { }
}

declare module "@ember/array/proxy" {
    export class ArrayProxy extends Ember.ArrayProxy { }
}

declare module "@ember/component" {
    export class Component extends Ember.Component { }
}

declare module "@ember/component/checkbox" {
    export class Checkbox extends Ember.Checkbox { }
}

declare module "@ember/component/helper" {
    export class Helper extends Ember.Helper { }
    export const helper: typeof Ember.Helper.helper;
}

declare module "@ember/component/text-area" {
    export class TextArea extends Ember.TextArea { }
}

declare module "@ember/component/text-field" {
    export class TextField extends Ember.TextField { }
}

declare module "@ember/controller" {
    export class Controller extends Ember.Controller { }
    export const inject: typeof Ember.inject.controller;
}

declare module "@ember/debug" {
    export const assert: typeof Ember.assert;
    export const debug: typeof Ember.debug;
    export const inspect: typeof Ember.inspect;
    export const registerDeprecationHandler: typeof Ember.Debug.registerDeprecationHandler;
    export const registerWarnHandler: typeof Ember.Debug.registerWarnHandler;
    export const runInDebug: typeof Ember.runInDebug;
    export const warn: typeof Ember.warn;
}

declare module "@ember/debug/container-debug-adapter" {
    export class ContainerDebugAdapter extends Ember.ContainerDebugAdapter { }
}

declare module "@ember/debug/data-adapter" {
    export class DataAdapter extends Ember.DataAdapter { }
}

declare module "@ember/engine" {
    export class Engine extends Ember.Engine { }
    export const getEngineParent: typeof Ember.getEngineParent;
}

declare module "@ember/engine/instance" {
    export class EngineInstance extends Ember.EngineInstance { }
}

declare module "@ember/enumerable" {
    export class Enumerable extends Ember.Enumerable { }
}

declare module "@ember/instrumentation" {
    export const instrument: typeof Ember.instrument;
    export const reset: typeof Ember.reset;
    export const subscribe: typeof Ember.subscribe;
    export const unsubscribe: typeof Ember.unsubscribe;
}

declare module "@ember/map" {
    export class EmberMap extends Ember.Map { }
}

declare module "@ember/map/with-default" {
    export class MapWithDefault extends Ember.MapWithDefault { }
}

declare module "@ember/object" {
    export class EmberObject extends Ember.Object { }
    export const aliasMethod: typeof Ember.aliasMethod;
    export const computed: typeof Ember.computed;
    export const defineProperty: typeof Ember.defineProperty;
    export const get: typeof Ember.get;
    export const getProperties: typeof Ember.getProperties;
    export const getWithDefault: typeof Ember.getWithDefault;
    export const observer: typeof Ember.observer;
    export const set: typeof Ember.set;
    export const setProperties: typeof Ember.setProperties;
    export const trySet: typeof Ember.trySet;
}

declare module "@ember/object/computed" {
    export class ComputedProperty extends Ember.ComputedProperty { }
    export const alias: typeof Ember.computed.alias;
    export const and: typeof Ember.computed.and;
    export const bool: typeof Ember.computed.bool;
    export const collect: typeof Ember.computed.collect;
    export const deprecatingAlias: typeof Ember.computed.deprecatingAlias;
    export const empty: typeof Ember.computed.empty;
    export const equal: typeof Ember.computed.equal;
    export const filter: typeof Ember.computed.filter;
    export const filterBy: typeof Ember.computed.filterBy;
    export const filterProperty: typeof Ember.computed.filterProperty;
    export const gt: typeof Ember.computed.gt;
    export const gte: typeof Ember.computed.gte;
    export const intersect: typeof Ember.computed.intersect;
    export const lt: typeof Ember.computed.lt;
    export const lte: typeof Ember.computed.lte;
    export const map: typeof Ember.computed.map;
    export const mapBy: typeof Ember.computed.mapBy;
    export const mapProperty: typeof Ember.computed.mapProperty;
    export const match: typeof Ember.computed.match;
    export const max: typeof Ember.computed.max;
    export const min: typeof Ember.computed.min;
    export const none: typeof Ember.computed.none;
    export const not: typeof Ember.computed.not;
    export const notEmpty: typeof Ember.computed.notEmpty;
    export const oneWay: typeof Ember.computed.oneWay;
    export const or: typeof Ember.computed.or;
    export const readOnly: typeof Ember.computed.readOnly;
    export const reads: typeof Ember.computed.reads;
    export const setDiff: typeof Ember.computed.setDiff;
    export const sort: typeof Ember.computed.sort;
    export const sum: typeof Ember.computed.sum;
    export const union: typeof Ember.computed.union;
    export const uniq: typeof Ember.computed.uniq;
    export const uniqBy: typeof Ember.computed.uniqBy;
}

declare module "@ember/object/core" {
    export class CoreObject extends Ember.CoreObject { }
}

declare module "@ember/object/evented" {
    export class Evented extends Ember.Evented { }
    export const on: typeof Ember.on;
}

declare module "@ember/object/events" {
    export const addListener: typeof Ember.addListener;
    export const removeListener: typeof Ember.removeListener;
    export const sendEvent: typeof Ember.sendEvent;
}

declare module "@ember/object/internals" {
    export const cacheFor: typeof Ember.cacheFor;
    export const copy: typeof Ember.copy;
    export const guidFor: typeof Ember.guidFor;
}

declare module "@ember/object/mixin" {
    export class Mixin extends Ember.Mixin { }
}

declare module "@ember/object/observable" {
    export class Observable extends Ember.Observable { }
}

declare module "@ember/object/observers" {
    export const addObserver: typeof Ember.addObserver;
    export const removeObserver: typeof Ember.removeObserver;
}

declare module "@ember/object/promise-proxy-mixin" {
    export class PromiseProxyMixin extends Ember.PromiseProxyMixin { }
}

declare module "@ember/object/proxy" {
    export class ObjectProxy extends Ember.ObjectProxy { }
}

declare module "@ember/polyfills" {
    export const assign: typeof Ember.assign;
    export const create: typeof Ember.create;
    export const hasPropertyAccessors: typeof Ember.platform.hasPropertyAccessors;
    export const keys: typeof Ember.keys;
    export const merge: typeof Ember.merge;
}

declare module "@ember/routing/auto-location" {
    export class AutoLocation extends Ember.AutoLocation { }
}

declare module "@ember/routing/hash-location" {
    export class HashLocation extends Ember.HashLocation { }
}

declare module "@ember/routing/history-location" {
    export class HistoryLocation extends Ember.HistoryLocation { }
}

declare module "@ember/routing/link-component" {
    export class LinkComponent extends Ember.LinkComponent { }
}

declare module "@ember/routing/location" {
    export class Location extends Ember.Location { }
}

declare module "@ember/routing/none-location" {
    export class NoneLocation extends Ember.NoneLocation { }
}

declare module "@ember/routing/route" {
    export class Route extends Ember.Route { }
}

declare module "@ember/routing/router" {
    export class Router extends Ember.Router { }
}

declare module "@ember/runloop" {
    export const begin: typeof Ember.run.begin;
    export const bind: typeof Ember.run.bind;
    export const cancel: typeof Ember.run.cancel;
    export const debounce: typeof Ember.run.debounce;
    export const end: typeof Ember.run.end;
    export const join: typeof Ember.run.join;
    export const later: typeof Ember.run.later;
    export const next: typeof Ember.run.next;
    export const once: typeof Ember.run.once;
    export const run: typeof Ember.run;
    export const schedule: typeof Ember.run.schedule;
    export const scheduleOnce: typeof Ember.run.scheduleOnce;
    export const throttle: typeof Ember.run.throttle;
}

declare module "@ember/service" {
    export class Service extends Ember.Service { }
    export const inject: typeof Ember.inject.service;
}

declare module "@ember/string" {
    export const camelize: typeof Ember.String.camelize;
    export const capitalize: typeof Ember.String.capitalize;
    export const classify: typeof Ember.String.classify;
    export const dasherize: typeof Ember.String.dasherize;
    export const decamelize: typeof Ember.String.decamelize;
    export const fmt: typeof Ember.String.fmt;
    export const htmlSafe: typeof Ember.String.htmlSafe;
    export const isHTMLSafe: typeof Ember.String.isHTMLSafe;
    export const loc: typeof Ember.String.loc;
    export const underscore: typeof Ember.String.underscore;
    export const w: typeof Ember.String.w;
}

declare module "@ember/test" {
    export const registerAsyncHelper: typeof Ember.Test.registerAsyncHelper;
    export const registerHelper: typeof Ember.Test.registerHelper;
    export const registerWaiter: typeof Ember.Test.registerWaiter;
    export const unregisterHelper: typeof Ember.Test.unregisterHelper;
    export const unregisterWaiter: typeof Ember.Test.unregisterWaiter;
}

declare module "@ember/test/adapter" {
    export class TestAdapter extends Ember.Test.Adapter { }
}

declare module "@ember/utils" {
    export const compare: typeof Ember.compare;
    export const isBlank: typeof Ember.isBlank;
    export const isEmpty: typeof Ember.isEmpty;
    export const isEqual: typeof Ember.isEqual;
    export const isNone: typeof Ember.isNone;
    export const isPresent: typeof Ember.isPresent;
    export const tryInvoke: typeof Ember.tryInvoke;
    export const typeOf: typeof Ember.typeOf;
}
