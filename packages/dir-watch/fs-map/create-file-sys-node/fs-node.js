const path = require('path');

module.exports = class FsNode {
    constructor(dirent, parentNode, customFn) {
        // const { name, isDirectory } = dirent;
        const isDirectory = dirent.isDirectory();
        this.dirent = dirent;
        this.isDirectory = isDirectory;
        this.name = dirent.name;
        this.sortPath = path.join(parentNode.sortPath, dirent.name);
        this.absPath = path.join(parentNode.absPath, dirent.name);
        this.parent = parentNode;
        this.children = isDirectory ? [] : null;
        this.customFn = (...args) => customFn && customFn.apply(this, args);
    }

    /**
     * 重命名
     * @param {String} newName
     */
    rename(newName) {
        const { children, sortPath, absPath } = this.parent;

        this.remove();
        children[newName] = this;

        this.name = newName;
        this.sortPath = path.join(sortPath, newName);
        this.absPath = path.join(absPath, newName);
        console.log('rename', this.dirent.name);
    }

    /**
     * 删除文件
     */
    remove() {
        delete this.parent.children[this.name];
    }
};
