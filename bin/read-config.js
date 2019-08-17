const fs = require('fs-extra');
const path = require('path');

function readConfig() {
    let config = null;
    const configFilePath = path.resolve(
        fs.realpathSync(process.cwd()),
        'flammae.config.js'
    );
    try {
        config = require(configFilePath);
    } catch (err) {}
    return config;
}

module.exports = readConfig;
