const fs = require('fs');
const path = require('path');
const createFsNode = require('./create-file-sys-node');
const RootNode = require('./create-file-sys-node/root-node');

module.exports = function createFileSysMap(absPath, parent) {
    /**
     * path must be absolute
     */
    if (!path.isAbsolute(absPath)) {
        throw TypeError(`path '${absPath}' must be absolute`);
    }

    /**
     * if parent is not exists create RootNode
     * TODO: validate type of parent
     */
    const parentNode = parent || new RootNode(absPath);

    /**
     * 读取文件夹第一级目录，生成dirent数组
     */
    const direntList = (() => {
        try {
            return fs.readdirSync(absPath, {
                encoding: 'utf8',
                withFileTypes: true,
            });
        } catch (err) {
            throw err;
        }
    })();

    if (!direntList.length) {
        return null;
    }

    /**
     * 递归文件夹，生成Map
     *
     * eslint: https://eslint.org/docs/rules/no-param-reassign
     */
    direntList.forEach((dirent) => {
        const fileNode = createFsNode(dirent, parentNode);
        parentNode.children.push(fileNode);
        if (fileNode.isDirectory) {
            createFileSysMap(fileNode.absPath, fileNode);
        }
    });

    return parentNode;
};
