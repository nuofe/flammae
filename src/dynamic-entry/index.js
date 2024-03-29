'use strict';

/* eslint-disable camelcase */
const { appEntryTempFile } = require('../paths');
const FileRender = require('./file-render');
const DynamicEntryRender = require('./dynamic-entry-render');

module.exports = function createDynamicEntry() {
    FileRender.render(DynamicEntryRender);
    return appEntryTempFile;
};
