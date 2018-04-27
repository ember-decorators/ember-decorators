const fs = require('fs');
const walkSync = require('walk-sync');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  walkSync('tests').forEach((path) => {
    if (path.includes('-test.js') && !path.includes('temp-typescript')) {
      let fullPath = `tests/${path}`;

      let file = fs.readFileSync(fullPath, { encoding: 'utf8' });

      file = file.replace('javascript |', 'typescript |');

      fs.writeFileSync(fullPath.replace('-test.js', '-temp-typescript-test.ts'), file);
    }
  });

  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
