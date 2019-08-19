'use strict';

const fs = require('fs');
const globTraverse = require('@flammae/fs-enhance/lib/globTraverse');
const parseRouteFiles = require('./utils/parseRouteData');
const writeFile = require('./utils/writeFile');
const { routeDataFileTpl: src } = require('../paths');
const { routeDataJsFile } = require('../fileSchema');
const getResolveApp = require('../shared/getResolveApp');
/**
 * 以promise的形式读取文件
 */
function readFilePromise(type, sortPath, absPath) {
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

module.exports = function returnWriteRouteDataFile(cwd) {
    const output = getResolveApp(cwd)(routeDataJsFile);

    return function writeRouteDataFile(done) {
        const promises = [];
        globTraverse({
            '/docs/**/*.md': (sortPath, absPath) => {
                promises.push(readFilePromise('doc', sortPath, absPath));
            },
            '/.theme/pages/*/**/index.jsx': (sortPath, absPath) => {
                promises.push(readFilePromise('page', sortPath, absPath));
            },
        });

        Promise.all(promises)
            .then(files => {
                const siteData = parseRouteFiles(files);
                writeFile(src, output, { siteData });
            })
            .catch(() => {
                // TODO
            })
            .finally(done);
    };
};
