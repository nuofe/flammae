const { getDirMap } = require('../dir-watcher');
const path = require('path');

const thisRoot = path.resolve(__dirname, './');
const map = getDirMap(thisRoot)

Object.keys(map).forEach(key => {
    console.log(map[key].isFile());
});