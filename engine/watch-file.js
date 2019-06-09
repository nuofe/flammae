const createFsMap = require('../packages/fs-map');
const writeTempIndexFileSync = require('./write-temp-index');
const writeTempAppFileSync = require('./write-temp-app');


module.exports = function watchAppDir(filename) {
    const fsMap = createFsMap(filename, (node) => {
        if (node.isDirectory) {
            let arr = [];
            node.children.forEach((child) => {
                const result = child.hook();
                if (child.isDirectory) {
                    arr = arr.concat(result);
                } else if (result !== false) {
                    arr.push(child.hook());
                }
            });
            return arr;
        }

        if (/\.md$/.test(node.name)) {
            return node.absPath;
        }

        return false;
    });

    fsMap.watch((eventType, node, absPath) => {
        const {
            name: nodeName,
            parent: parentNode,
            level,
        } = node;
        const {
            name: parentNodeName,
            level: parentLevel,
        } = parentNode;

        if (nodeName === 'docs' && level === 1) {
            node.hook();
        } else if (
            parentNodeName === '.theme'
            && parentLevel === 1
        ) {
            if (nodeName === 'styles') {
                writeTempIndexFileSync();
            } else if (nodeName === 'templates') {
                writeTempAppFileSync();
            }
        }
    });
};
