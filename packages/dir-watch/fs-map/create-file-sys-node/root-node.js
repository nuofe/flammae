const path = require('path');

module.exports = class RootNode {
    constructor(absPath) {
        const sortPath = path.basename(absPath);
        this.absPath = absPath;
        this.sortPath = sortPath;
        this.rootNode = true;
    }
};