const fs = require('fs');
const path = require('path');

module.exports = function createFileNode(dirent, parentNode) {
    return new FileNode(dirent, parentNode);
};

/**
 *
 */
class FileNode {
    constructor(dirent, parentNode) {
        const isDirectory = dirent.isDirectory();
        this.dirent = dirent;
        this.isDirectory = isDirectory;
        this.name = dirent.name;
        this.absPath = path.join(parentNode.absPath, dirent.name);
        this.parent = parentNode;
        this.children = null;
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

    /**
     * 创建文件
     */
    mk() {
        //
    }
    rename() {

    }
    remove() { }
}
