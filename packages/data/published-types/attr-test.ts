import Model from 'ember-data/model';
import { attr } from '@ember-decorators/data';

class MyModel1 extends Model {
  // @attr firstName: null
}

class MyModel2 extends Model {
  @attr('string') firstName: null;
}

class MyModel3 extends Model {
  @attr('string', { allowNull: false }) firstName: null;
}

class MyModel4 extends Model {
  @attr() firstName: null;
}
