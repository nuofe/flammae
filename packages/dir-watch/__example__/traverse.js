const path = require('path');
const createFsMap = require('../fs-map');
const traverse = require('../fs-map-tools/traverse');

const fsMap = createFsMap(path.resolve(__dirname, '../'));

traverse(fsMap, {
    'create-file-sys-node': (v) => {
        console.log(v);
    },
});
