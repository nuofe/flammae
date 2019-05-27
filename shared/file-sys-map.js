const fs = require('fs');
const path = require('path');

// TODO: 将dirPath转换为绝对路径
module.exports = function genFileSysMap(dirPath, parent) {
    const absPath = path.resolve(__dirname, dirPath);

    const parentNode = parent || {
        absPath,
        rootNode: true,
    };
    /**
     * 读取文件夹第一级目录，生成dirent数组
     */
    const direntList = readdirSync(absPath);

    /**
     * 递归文件夹，生成Map
     *
     * eslint: https://eslint.org/docs/rules/no-param-reassign
     */
    /* eslint no-param-reassign: ['error', { 'ignorePropertyModificationsFor': [ 'fsMap'] }] */
    return direntList.reduce((fsMap, dirent) => {
        const fileNode = createFileNode(dirent, parentNode);
        if (dirent.isDirectory()) {
            fsMap[dirent.name].children = genFileSysMap(fileNode.absPath, fileNode);
        }
        return fsMap;
    }, {});
};

/**
 * 读取文件夹第一级目录内文件列表，生成dirent数组
 */
function readdirSync(dirPath) {
    try {
        return fs.readdirSync(dirPath, {
            encoding: 'utf8',
            withFileTypes: true,
        });
    }
    catch (err) {
        throw err;
    }
}

function createFileNode(dirent, parentNode) {
    const isDirectory = dirent.isDirectory();
    const node = {
        dirent,
        isDirectory,
        name: dirent.name,
        absPath: path.join(parentNode.absPath, dirent.name),
        parent: parentNode,

    };
    return node;
}
/* eslint-disable */
class FileNode {
    /* 文件夹操作 */
    open() { }
    /* 自身操作 */
    mk() { }
    rename() { }
    remove() { }
    /* 修改内部文件 */
    createFile() { }
    deleteFile() { }


}
