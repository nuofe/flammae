const path = require('path');

module.exports = class FsNode {
    constructor(dirent, parentNode, customFn) {
        const { name, isDirectory } = dirent;
        this.dirent = dirent;
        this.isDirectory = isDirectory();
        this.name = name;
        this.sortPath = path.join(parentNode.sortPath, name);
        this.absPath = path.join(parentNode.absPath, name);
        this.parent = parentNode;
        this.children = null;
        this.customFn = (...args) => customFn && customFn.apply(this, args);
    }

    /**
     * 重命名
     * @param {String} newName
     */
    rename(newName) {
        this.parent[newName] = this;
        this.name = newName;
        this.sortPath = path.join(this.parent.sortPath, newName);
        this.absPath = path.join(this.parent.absPath, newName);
        console.log('rename', this.dirent.name);
    }

    /**
     * 删除文件
     */
    remove() {
        delete this.parent[this.name];
    }
};
