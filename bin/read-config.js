'use strict';

const fs = require('fs-extra');
const path = require('path');

function readConfig() {
    let config = null;
    const configFilePath = path.resolve(
        fs.realpathSync(process.cwd()),
        'flammae.config.js'
    );
    try {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        config = require(configFilePath);
    } catch (err) {
        // do nothing
    }
    return config;
}

module.exports = readConfig;
