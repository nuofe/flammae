const path = require('path');

module.exports = class FsNode {
    constructor(filename, stats, parent, customFn) {
        const isDirectory = stats.isDirectory();
        const { sortPath, root, absPath } = parent;

        this.stats = stats;

        /**
         * 文件唯一标识符
         */
        this.ino = stats.ino;

        /**
         * 类型标识
         */
        this.isDirectory = isDirectory;

        /**
         * 文件名
         */
        this.name = filename;
        this.lastFilename = undefined;

        /**
         * 短路径 /a/b/c
         */
        this.sortPath = root ? path.sep : path.join(sortPath, filename);

        /**
         * 从盘符开始的绝对路径 c:\\a\\b\\c
         */
        this.absPath = root ? absPath : path.join(absPath, filename);

        /**
         * 链路
         */
        this.parent = root ? null : parent;
        this.children = isDirectory ? [] : null;

        this.customFn = customFn ? (...args) => customFn.apply(this, args) : null;
    }
};
