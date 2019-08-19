'use strict';

const fs = require('fs-extra');
const getResolveApp = require('../shared/getResolveApp');
const { routerJsxFile } = require('../fileSchema');
const { appRouterCompTplFile: output } = require('../paths');

module.exports = function returnCopyRouterFile(cwd) {
    const resolveApp = getResolveApp(cwd);
    const src = resolveApp(routerJsxFile);
    return function copyRouterFile(done) {
        fs.copyFile(src, output, err => {
            if (err) {
                // TODO
            }
            done();
        });
    };
};
