const watchAppDir = require('../dir-watcher');
const path = require('path');

const thisRoot = path.resolve(__dirname, './');
console.log(watchAppDir)
watchAppDir(thisRoot);