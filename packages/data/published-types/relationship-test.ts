import Model from 'ember-data/model';
import { hasMany, belongsTo, attr } from '@ember-decorators/data';

class Person extends Model {
  @attr name!: string;
  @hasMany('book')
  publishedBooks!: Book[];
  myBooks!: Book[];

  @hasMany books!: Book;
}

class Book extends Model {
  @attr title!: string;
  @belongsTo('person') author!: Person;
  @belongsTo('person', { async: false }) author2!: Person;
  myAuthor!: Person[];

  @belongsTo person!: Person;
}

const ClassicPerson = Model.extend({
  name: attr(),
  publishedBooks: hasMany('classic-book'),
});

const ClassicBook = Model.extend({
  title: attr(),
  author: belongsTo('classic-person'),
  author2: belongsTo('person', { async: false }),
});
