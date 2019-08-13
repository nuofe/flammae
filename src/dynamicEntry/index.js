'use strict';

/* eslint-disable camelcase */
const { appEntryTempFile } = require('../paths');
const renderRouteDataFile = require('./renderRouteDataFile');

const { exec, serial } = {};

module.exports = function createDynamicEntry(cwd) {
    exec(serial(renderRouteDataFile))
        .at(cwd)
        .watch();
    return appEntryTempFile;
};
