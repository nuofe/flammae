const fs = require('fs');
const path = require('path');
const FsNode = require('./fs-node');
const createFsNode = require('./index');

/**
 * DirNode
 */
module.exports = class DirNode extends FsNode {
    /**
     * make file or dir
     * @param {string} filename a filename, best be basename
     */
    make(filename) {
        const basename = path.basename(filename);
        const children = this.children || {};
        const absPath = path.resolve(this.absPath, basename);
        const fakeDirent = Object.assign({}, fs.statSync(absPath), { name: basename });
        children[basename] = createFsNode(fakeDirent, this);
        this.children = children;
    }

    /**
     * 读取文件夹
     * @param {object} options options for fs.readdirSync
     */
    readdirSync(options) {
        try {
            return fs.readdirSync(this.absPath, options || {
                encoding: 'utf-8',
            });
        } catch (err) {
            throw err;
        }
    }
};
