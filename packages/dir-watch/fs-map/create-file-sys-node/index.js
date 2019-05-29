const DirNode = require('./dir-node');
const FileNode = require('./file-node');

module.exports = function createFileNode(dirent, parentNode) {
    const Constructor = dirent.isDirectory() ? DirNode : FileNode;
    return new Constructor(dirent, parentNode);
};
