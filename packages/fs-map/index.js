const path = require('path');
const { readdirSync } = require('./utils');
const createFileNode = require('./create-file-node');
const createRootNode = require('./create-root-node');

// TODO: 将dirPath转换为绝对路径
module.exports = function genFileSysMap(dirPath, parent) {
    const absPath = path.resolve(__dirname, dirPath);

    const parentNode = parent || createRootNode(absPath);
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
    return direntList.reduce((fsMap, dirent) => {
        const fileNode = createFileNode(dirent, parentNode);
        if (dirent.isDirectory()) {
            fileNode.children = genFileSysMap(fileNode.absPath, fileNode);
        }
        fsMap[dirent.name] = fileNode;
        return fsMap;
    }, {});
};
