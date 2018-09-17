'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy controller', function() {
  setupTestHooks(this);

  describe('in app', function() {
    beforeEach(function() {
      return emberNew();
    });

    it('controller foo', function() {
      return emberGenerateDestroy(['controller', 'foo'], _file => {
        expect(_file('app/controllers/foo.js'))
          .to.contain("import Controller from '@ember/controller';")
          .to.contain('export default class FooController extends Controller {\n}');

        expect(_file('tests/unit/controllers/foo-test.js'))
          .to.exist;
      });
    });

    it('controller foo/bar', function() {
      return emberGenerateDestroy(['controller', 'foo/bar'], _file => {
        expect(_file('app/controllers/foo/bar.js'))
          .to.contain("import Controller from '@ember/controller';")
          .to.contain('export default class FooBarController extends Controller {\n}');

        expect(_file('tests/unit/controllers/foo/bar-test.js'))
          .to.exist;
      });
    });

  });
});
