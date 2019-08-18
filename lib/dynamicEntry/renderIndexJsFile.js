'use strict';

const globTraverse = require('@flammae/fs-enhance/lib/globTraverse');
const { sepToModuleSystem } = require('@flammae/helpers');
const { appIndexFileTpl } = require('../paths');
const renderFile = require('./renderFile');

module.exports = function getRenderIndexJsFile(output) {
    return function renderIndexJsFile(done) {
        const stylePaths = [];
        globTraverse({
            '/.theme/styles/*.{css,scss,less,sass,styl}': (
                sortPath,
                absPath
            ) => {
                stylePaths.push(sepToModuleSystem(absPath));
            },
        });
        renderFile(appIndexFileTpl, output, { stylePaths });
        done();
    };
};
