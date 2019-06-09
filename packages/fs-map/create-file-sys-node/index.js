
module.exports = function createFsNode(filename, stats, parentNode, hook) {
    const Constructor = stats.isDirectory() ? DirNode : FileNode;
    const fileNode = new Constructor(filename, stats, parentNode, hook);
    return fileNode;
};

const DirNode = require('./dir-node');
const FileNode = require('./file-node');
