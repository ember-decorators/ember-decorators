'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
const setupPodConfig = blueprintHelpers.setupPodConfig;

const chai = require('ember-cli-blueprint-test-helpers/chai');
const expect = chai.expect;
const file = chai.file;

describe('Blueprint: route', function() {
  setupTestHooks(this);

  describe('in app', function() {
    beforeEach(function() {
      return emberNew();
    });

    it('route foo', function() {
      return emberGenerateDestroy(['route', 'foo'], (_file) => {
        expect(_file('app/routes/foo.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooRoute extends Route {\n}');

        expect(_file('app/templates/foo.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('tests/unit/routes/foo-test.js'))
          .to.exist;

        expect(file('app/router.js'))
          .to.contain('this.route(\'foo\')');

      }).then(() => {
        expect(file('app/router.js'))
          .to.not.contain('this.route(\'foo\')');
      });
    });

    it('route parent/child --reset-namespace', function() {
      return emberGenerateDestroy(['route', 'parent/child', '--reset-namespace'], (_file) => {
        expect(_file('app/routes/child.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class ParentChildRoute extends Route {\n}');

        expect(_file('app/templates/child.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('tests/unit/routes/child-test.js'))
          .to.exist;

        expect(file('app/router.js'))
          .to.contain('this.route(\'parent\', {')
          .to.contain('this.route(\'child\', {')
          .to.contain('resetNamespace: true')
          .to.contain('});');
      });
    });

    it('route foo --pod', function() {
      return emberGenerateDestroy(['route', 'foo', '--pod'], (_file) => {
        expect(_file('app/foo/route.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooRoute extends Route {\n}');

        expect(_file('app/foo/template.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('tests/unit/foo/route-test.js'))
          .to.exist;

        expect(file('app/router.js'))
          .to.contain('this.route(\'foo\')');

      }).then(() => {
        expect(file('app/router.js'))
          .to.not.contain('this.route(\'foo\')');
      });
    });

    describe('with podModulePrefix', function() {
      beforeEach(function() {
        setupPodConfig({ podModulePrefix: true });
      });

      it('route foo --pod', function() {
        return emberGenerateDestroy(['route', 'foo', '--pod'], (_file) => {
          expect(_file('app/pods/foo/route.js'))
            .to.contain('import Route from \'@ember/routing/route\';')
            .to.contain('export default class FooRoute extends Route {\n}');

          expect(_file('app/pods/foo/template.hbs'))
            .to.equal('{{outlet}}');

          expect(_file('tests/unit/pods/foo/route-test.js'))
            .to.exist;

          expect(file('app/router.js'))
            .to.contain('this.route(\'foo\')');

        }).then(() => {
          expect(file('app/router.js'))
            .to.not.contain('this.route(\'foo\')');
        });
      });
    });
  });

  describe('in addon', function() {
    beforeEach(function() {
      return emberNew({ target: 'addon' });
    });

    it('route foo', function() {
      return emberGenerateDestroy(['route', 'foo'], (_file) => {
        expect(_file('addon/routes/foo.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooRoute extends Route {\n}');

        expect(_file('addon/templates/foo.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('app/routes/foo.js'))
          .to.contain('export { default } from \'my-addon/routes/foo\';');

        expect(_file('app/templates/foo.js'))
          .to.contain('export { default } from \'my-addon/templates/foo\';');

        expect(_file('tests/unit/routes/foo-test.js'))
          .to.exist;

        expect(file('tests/dummy/app/router.js'))
          .to.not.contain('this.route(\'foo\')');

      }).then(() => {
        expect(file('tests/dummy/app/router.js'))
          .to.not.contain('this.route(\'foo\')');
      });
    });

    it('route foo/bar', function() {
      return emberGenerateDestroy(['route', 'foo/bar'], (_file) => {
        expect(_file('addon/routes/foo/bar.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooBarRoute extends Route {\n}');

        expect(_file('addon/templates/foo/bar.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('app/routes/foo/bar.js'))
          .to.contain('export { default } from \'my-addon/routes/foo/bar\';');

        expect(_file('app/templates/foo/bar.js'))
          .to.contain('export { default } from \'my-addon/templates/foo/bar\';');

        expect(_file('tests/unit/routes/foo/bar-test.js'))
          .to.exist;

        expect(file('tests/dummy/app/router.js'))
          .to.not.contain('this.route(\'bar\')');

      }).then(() => {
        expect(file('tests/dummy/app/router.js'))
          .to.not.contain('this.route(\'bar\')');
      });
    });
  });

  describe('in in-repo-addon', function() {
    beforeEach(function() {
      return emberNew({ target: 'in-repo-addon' });
    });

    it('route foo --in-repo-addon=my-addon', function() {
      return emberGenerateDestroy(['route', 'foo', '--in-repo-addon=my-addon'], (_file) => {
        expect(_file('lib/my-addon/addon/routes/foo.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooRoute extends Route {\n}');

        expect(_file('lib/my-addon/addon/templates/foo.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('lib/my-addon/app/routes/foo.js'))
          .to.contain('export { default } from \'my-addon/routes/foo\';');

        expect(_file('lib/my-addon/app/templates/foo.js'))
          .to.contain('export { default } from \'my-addon/templates/foo\';');

        expect(_file('tests/unit/routes/foo-test.js'))
          .to.exist;
      });
    });

    it('route foo/bar --in-repo-addon=my-addon', function() {
      return emberGenerateDestroy(['route', 'foo/bar', '--in-repo-addon=my-addon'], (_file) => {
        expect(_file('lib/my-addon/addon/routes/foo/bar.js'))
          .to.contain('import Route from \'@ember/routing/route\';')
          .to.contain('export default class FooBarRoute extends Route {\n}');

        expect(_file('lib/my-addon/addon/templates/foo/bar.hbs'))
          .to.equal('{{outlet}}');

        expect(_file('lib/my-addon/app/routes/foo/bar.js'))
          .to.contain('export { default } from \'my-addon/routes/foo/bar\';');

        expect(_file('lib/my-addon/app/templates/foo/bar.js'))
          .to.contain('export { default } from \'my-addon/templates/foo/bar\';');

        expect(_file('tests/unit/routes/foo/bar-test.js'))
          .to.exist;
      });
    });
  });
});
