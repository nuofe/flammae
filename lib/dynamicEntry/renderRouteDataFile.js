'use strict';

const fs = require('fs');
const { glob } = require('@flammae/fs-helpers');

/**
 * 以promise的形式读取文件
 */
function readFilePromise(sortPath, absPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(absPath, { encoding: 'utf8' }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                data,
                type,
                sortPath,
                filePath: absPath,
            });
        });
    });
}

module.exports = function returnRenderRouteDataFile(output) {
    return function renderRouteDataFile(done) {
        const promises = [];
        glob(
            '{/docs/**/*.md,/.theme/pages/*/**/index.jsx}',
            (sortPath, absPath) => {
                promises.push(readFilePromise(sortPath, absPath));
            }
        );

        Promise.all(promises)
            .catch(err => {
                // TODO
            })
            .finally(done);
    };
};
