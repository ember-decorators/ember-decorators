import DS from 'ember-data';

import macroAlias from './macro-alias';

export var attr = macroAlias(DS.attr);
export var hasMany = macroAlias(DS.hasMany);
export var belongsTo = macroAlias(DS.belongsTo);
