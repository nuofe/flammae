'use strict';

/**
 * 以promise的形式读取文件
 */
function readFilePromise(node, type) {
    return new Promise((resolve, reject) => {
        node.readFile(
            {
                encoding: 'utf8',
            },
            (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    data,
                    type,
                    sortPath: node.sortPath,
                    filePath: node.absPath,
                });
            }
        );
    });
}

module.exports = function renderRouteDataFile({ src }) {
    src('{/docs/**/*.md,/.theme/pages/*/**/index.jsx}').then(fileNodes => {
        fileNodes.map(readFilePromise);
    });
};
