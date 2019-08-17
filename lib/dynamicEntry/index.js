'use strict';

/* eslint-disable camelcase */
const { executor, serial, parallel } = require('@flammae/task');
const { appEntryTempFile } = require('../paths');

const returnRenderIndexJsFile = require('./renderIndexJsFile');
const returnRenderRouteDataFile = require('./renderRouteDataFile');
const returnRenderFlammaeJsFile = require('./renderFlammaeJsFile');
const returnRenderMdRendererJsFile = require('./renderMdRendererJsFile');

module.exports = function createDynamicEntry(cwd) {
    const renderIndexJs = returnRenderIndexJsFile();
    const renderRouteDataFile = returnRenderRouteDataFile();
    const renderFlammaeJsFile = returnRenderFlammaeJsFile();
    const renderMdRendererJsFile = returnRenderMdRendererJsFile();

    executor(
        parallel(
            renderRouteDataFile,
            renderIndexJs,
            renderFlammaeJsFile,
            renderMdRendererJsFile
        )
    );
    return appEntryTempFile;
};
