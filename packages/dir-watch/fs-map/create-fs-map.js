const path = require('path');
const { readdirSync } = require('./utils');
const traverse = require('./traverse');
const createFsNode = require('./create-file-sys-node');
const RootNode = require('./create-file-sys-node/root-node');

module.exports = function createFileSysMap(absPath, parent) {
    if (!path.isAbsolute(absPath)) {
        throw TypeError(`path ${absPath} must be absolute`);
    }

    const parentNode = parent || new RootNode(absPath);

    /**
     * 读取文件夹第一级目录，生成dirent数组
     */
    const direntList = readdirSync(absPath, {
        encoding: 'utf8',
        withFileTypes: true,
    });

    /**
     * 递归文件夹，生成Map
     *
     * eslint: https://eslint.org/docs/rules/no-param-reassign
     */
    /* eslint no-param-reassign: ['error', { 'ignorePropertyModificationsFor': [ 'fsMap'] }] */
    // eslint-disable-next-line no-shadow
    const fsMap = direntList.reduce((fsMap, dirent) => {
        const fileNode = createFsNode(dirent, parentNode);
        if (dirent.isDirectory()) {
            fileNode.children = createFileSysMap(fileNode.absPath, fileNode);
        }
        fsMap[dirent.name] = fileNode;
        return fsMap;
    }, {});

    fsMap.traverse = traverse.bind(fsMap);

    return fsMap;
};
