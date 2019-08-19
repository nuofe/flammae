'use strict';

const fs = require('fs-extra');

module.exports = function returnRenderEntry(filePath, content = '') {
    return function renderEntry(done) {
        fs.writeFileSync(filePath, content, {
            encoding: 'utf8',
        });
        done();
    };
};
