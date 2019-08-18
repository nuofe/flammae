'use strict';

const fs = require('fs');
const globTraverse = require('@flammae/fs-enhance/lib/globTraverse');
const parseRouteFiles = require('./parseRouteData');
const renderFile = require('./renderFile');
const { routeDataFileTpl } = require('../paths');
const { routeDataJsFile } = require('../fileSchema');

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

module.exports = function returnRenderRouteDataFile(resolveApp) {
    const output = resolveApp(routeDataJsFile);
    return function renderRouteDataFile(done) {
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
                renderFile(routeDataFileTpl, output, { siteData });
            })
            .catch(() => {
                // TODO
            })
            .finally(done);
    };
};
