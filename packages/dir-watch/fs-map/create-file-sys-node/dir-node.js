const fs = require('fs');
const path = require('path');
const FsNode = require('./fs-node');
const createFsNode = require('./index');

/**
 * 文件夹
 */
module.exports = class DirNode extends FsNode {
    /**
     * 创建文件
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
     */
    readdirSync(options) {
        try {
            return fs.readdirSync(this.absPath, options || {
                encoding: 'utf-8',
            });
        }
        catch (err) {
            throw err;
        }
    }
};
