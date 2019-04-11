/* eslint-env node */
const fs = require('fs');
const path = require('path');

module.exports = {
  description: 'Adds decorator transform packages and settings to the parent app',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    // load .eslintrc
    let eslintrcPath = path.join(this.project.root, '.eslintrc.js');
    let eslintrc = fs.existsSync(eslintrcPath) && fs.readFileSync(eslintrcPath, { encoding: 'utf8' });
    let eslintrcLines = eslintrc && eslintrc.split('\n');
    // load tsconfig.json
    let tsconfigPath = path.join(this.project.root, 'tsconfig.json');
    let tsconfigJSON = fs.existsSync(tsconfigPath) && fs.readFileSync(tsconfigPath, { encoding: 'utf8' });
    let tsconfig = tsconfigJSON && JSON.parse(tsconfigJSON);

    // Mod .eslintrc file to add parser if it doesn't already have one defined
    let parserIndex = eslintrcLines && eslintrcLines.findIndex(line => line.match(/parser:/));
    let rootIndex = eslintrcLines && eslintrcLines.findIndex(line => line.match(/root:/));

    if (parserIndex > -1) {
      this.project.ui.writeWarnLine(
        `Found an ESLint parser already defined, and so could not automatically set the eslint parser. You
         may need to add \`parser: 'babel-eslint'\` to your eslintrc.js. Note: if specifically using another
         parser (like, \`parser: 'typescript-eslint-parser'\`), this may not be necessary.`
      );
    } else if (eslintrcLines && rootIndex > -1) {
      eslintrcLines.splice(rootIndex + 1, 0, `  parser: 'babel-eslint',`);
      fs.writeFileSync(eslintrcPath, eslintrcLines.join('\n'));
    } else {
      this.project.ui.writeWarnLine(
        'Could not automatically set the eslint parser, add `parser: \'babel-eslint\' to your eslintrc.js'
      );
    }

    // If tsconfig file found, add experimentalDecorators support
    if (tsconfig && (typeof tsconfig.compilerOptions === 'object' || !tsconfig.compilerOptions)) {
      tsconfig.compilerOptions = Object.assign(tsconfig.compilerOptions || {}, { experimentalDecorators: true });
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    return this.addPackageToProject('babel-eslint', '^8.0.0');
  }
};
