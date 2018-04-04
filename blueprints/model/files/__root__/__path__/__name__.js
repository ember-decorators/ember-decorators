import DS from 'ember-data';
const { Model, belongsTo, hasMany, attr} = DS;

export default class <%= classifiedModuleName %>Model extends Model {
<%= attrs.length ? '  ' + attrs : '' %>
}
