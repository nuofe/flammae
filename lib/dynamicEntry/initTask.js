'use strict';

const fs = require('fs-extra');

module.exports = function returnInitTask(appFlammae) {
    return function init(done) {
        fs.ensureDirSync(appFlammae);
        done();
    };
};
