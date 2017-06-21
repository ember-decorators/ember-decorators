import DS from 'ember-data';
import { decoratorWithKeyReflection } from './utils/decorator-macros';

export const attr = decoratorWithKeyReflection(DS.attr);
export const hasMany = decoratorWithKeyReflection(DS.hasMany);
export const belongsTo = decoratorWithKeyReflection(DS.belongsTo);
