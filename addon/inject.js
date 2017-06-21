import Ember from 'ember';
import { decoratorWithKeyReflection } from './utils/decorator-macros';

export const service = decoratorWithKeyReflection(Ember.inject.service);
export const controller = decoratorWithKeyReflection(Ember.inject.controller);
