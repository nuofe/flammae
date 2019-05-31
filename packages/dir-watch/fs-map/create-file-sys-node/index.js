const DirNode = require('./dir-node');
const FileNode = require('./file-node');

module.exports = function createFileNode(filename, stats, parentNode) {
    const Constructor = stats.isDirectory() ? DirNode : FileNode;
    const fileNode = new Constructor(filename, stats, parentNode);
    return fileNode;
};
