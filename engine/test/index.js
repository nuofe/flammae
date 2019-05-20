const watchAppDir = require('../watch-file');
const path = require('path');

const thisRoot = path.resolve(__dirname, './');

watchAppDir(thisRoot);