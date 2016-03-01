var path = require('path');
var jspmPackages = 'jspm_packages';

var appRoot = 'src/';

module.exports = {
  root: appRoot,
  javascript: appRoot + '**/*.js',
  typescript: appRoot + '**/*.ts',
  typesciptDefinitions: ['./typings/**/*.ts', './jspm_packages/**/*.d.ts'],
  unitTesting: 'src/unitTesting/**/*.ts',
  specs: 'src/**/*.spec.ts',
  html: [appRoot + '**/*.html', appRoot + '**/*.gif', appRoot + '**/*.scss'],
  sass: appRoot + '**/*.scss',
  output: 'dev/',
  doc: './doc',
  jspmPackages: jspmPackages,
  buildSyncFile: 'dev/buildSyncFile.txt',
  release: {
    output: 'dist/'
  },
  deps: []
};
