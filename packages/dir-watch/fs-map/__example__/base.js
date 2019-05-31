const path = require('path');
const createFsMap = require('../index');

console.log(createFsMap(path.resolve(__dirname, '../')));
