'use strict';

const globTraverse = require('@flammae/fs-enhance/lib/globTraverse');
const { sepToModuleSystem } = require('@flammae/helpers');
const getResolveApp = require('../shared/getResolveApp');
const { appIndexFileTpl: src } = require('../paths');
const { appIndexJsFile } = require('../fileSchema');
const writeFile = require('./utils/writeFile');

module.exports = function returnWriteIndexJsFile(cwd) {
    const resolveApp = getResolveApp(cwd);
    const output = resolveApp(appIndexJsFile);

    return function writeIndexJsFile(done) {
        const stylePaths = [];
        globTraverse({
            '/.theme/styles/*.{css,scss,less,sass,styl}': (
                sortPath,
                absPath
            ) => {
                stylePaths.push(sepToModuleSystem(absPath));
            },
        });
        writeFile(src, output, { stylePaths });
        done();
    };
};
