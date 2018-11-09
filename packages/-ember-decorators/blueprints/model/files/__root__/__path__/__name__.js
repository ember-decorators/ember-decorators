import DS from 'ember-data';
const { Model } = DS;
<%= generatorImports.length ? 'import { '+generatorImports+' } from \'@ember-decorators/data\';\n' : '' %>
export default class <%= classifiedModuleName %>Model extends Model {
<%= attrs.length ? attrs : '' %>
}
