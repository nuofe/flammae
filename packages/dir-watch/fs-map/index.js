const fs = require('fs');
const path = require('path');
const createFsNode = require('./create-file-sys-node');
const DirNode = require('./create-file-sys-node/dir-node');

module.exports = function createFileSysMap(absPath, parent) {
    /**
     * path must be absolute
     */
    if (!path.isAbsolute(absPath)) {
        throw TypeError(`path '${absPath}' must be absolute`);
    }

    /**
     * if parent is not exists create Root Node
     * TODO: validate type of parent
     */
    const parentNode = parent || createRootDirNode(absPath);
    /**
     * 读取文件夹第一级目录，生成dirent数组
     */
    const filenameArr = (() => {
        try {
            return fs.readdirSync(absPath, {
                encoding: 'utf8',
            });
        } catch (err) {
            throw err;
        }
    })();

    if (!filenameArr.length) {
        return null;
    }

    /**
     * 递归文件夹，生成Map
     *
     * eslint: https://eslint.org/docs/rules/no-param-reassign
     */
    filenameArr.forEach((filename) => {
        let fileStats = null;
        try {
            fileStats = fs.statSync(path.join(absPath, filename));
        } catch (err) {
            throw err;
        }
        if (!fileStats) {
            return;
        }
        const fileNode = createFsNode(filename, fileStats, parentNode);

        parentNode.children.push(fileNode);

        if (fileNode.isDirectory) {
            createFileSysMap(fileNode.absPath, fileNode);
        }
    });

    return parentNode;
};

function createRootDirNode(absPath) {
    const stats = fs.statSync(absPath);
    const basename = path.basename(absPath);

    return new DirNode(basename, stats, {
        absPath,
        root: true,
    });
}
