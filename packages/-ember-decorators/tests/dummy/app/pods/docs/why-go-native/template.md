# Why Go Native?

The Ember object-model has served Ember well over the years, and really was a
solid foundation during the early years of the framework being built on ES5
only. Now that native syntax has finally almost caught up feature-wise though,
switching to native classes will unlock a number of major benefits, including:

1. ### Integration with the Javascript community

  The Ember object-model was never picked up outside of the Ember community, and
  the wider Javascript community has continued to evolve their own standards,
  libraries, and practices. As classes solidify into a first class feature of
  the language, they will continue to gain usage, with more and more supporting
  libraries, frameworks, and code written for them. Ember is all about shared
  solutions, and standard native classes will allow us to share a solution with
  the _entire_ Javascript community.

2. ### Lower teaching cost

  The Ember object-model is a stumbling block for new users of Ember because its
  not Just Javascript. It requires learning a class definition and inheritance
  structure, a mixin system, and a whole bunch of gotchas. As native classes
  grow in adoption, Javascript developers in general will become more familiar
  with them by _default_, and there will be many resources teaching them how
  classes, fields, and decorators work. All of this lowers the cost of hiring
  and training new developers.

3. ### Better tooling from editors

  Modern text editors like VSCode and Atom have been adding more and better
  support for things like autocompletion, method signature reference, go to
  definition, and general IDE like behavior. These features can increase
  developer productivity by a huge margin, making it easier to find docs, look
  up APIs, and catch errors and bad practices early with static analysis.

  <video src="{{root-url 'assets/videos/editor-demo.mp4'}}" autoplay loop>
  </video>

4. ### Better tooling in general

  Other tools will be able to leverage a common class framework, leading to even
  more shared solutions for tooling and other repetitive work. A great example
  of this is [ESDoc](https://esdoc.org/), which is the documenter that generates
  our API docs! It can infer much more about your classes than traditional
  documenters like JSDoc and YUIDoc because it reads native class syntax:

  ```js
  // YUIDoc

  /*
    A foo class

    @class Foo
    @extends Bar
  */
  const Foo = Bar.extend({
    /*
      A property

      @property prop1
    */
    prop1: 123,

    /*
      A method

      @method doSomething
    */
   doSomething() {}
  });

  // ESDoc

  /*
    A foo class
  */
  class Foo extends Bar {
    /* A property */
    prop1 = 123;

    /* A method */
    doSomething() {}
  }
  ```

  The two above examples would produce exactly the same documentation! ESDoc
  doesn't requires tags most of the time, allowing you to write code without
  worrying about maintenance.
