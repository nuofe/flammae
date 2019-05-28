
module.exports = function createRootNode(absPath) {
    return {
        absPath,
        rootNode: true,
    };
};
