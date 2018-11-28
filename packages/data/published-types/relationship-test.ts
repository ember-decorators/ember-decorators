import Model from 'ember-data/model';
import { hasMany, belongsTo, attr } from '@ember-decorators/data';

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line:strict-export-declare-modifiers
  export default interface Registry {
    book: Book;
    person: Person;
  }
}

class Person extends Model {
  @attr name!: string;
  @hasMany('book')
  publishedBooks!: Book[];
  @hasMany('boo') // $ExpectError
  myBooks!: Book[];
  @hasMany books!: Book[];
}

class Book extends Model {
  @attr title!: string;
  @belongsTo('person') author!: Person[];
  @belongsTo('person', { async: false }) author2!: Person[];
  @belongsTo('persn') // $ExpectError
  myAuthor!: Person[];

  @belongsTo person!: Person[];
}
