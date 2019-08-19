'use strict';

const fs = require('fs-extra');
const { appFlammaeDir } = require('../fileSchema');
const getResolveApp = require('../shared/getResolveApp');

module.exports = function returnInitTask(cwd) {
    const resolveApp = getResolveApp(cwd);
    return function init(done) {
        fs.ensureDirSync(resolveApp(appFlammaeDir));
        done();
    };
};
