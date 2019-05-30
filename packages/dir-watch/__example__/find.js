const path = require('path');
const createFsMap = require('../fs-map');
const find = require('../fs-map-tools/find');

const fsMap = createFsMap(path.resolve(__dirname, '../'));

console.log(find(path.resolve('../__example__/find.js'), fsMap));
