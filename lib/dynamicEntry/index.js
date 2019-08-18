'use strict';

/* eslint-disable camelcase */
const fs = require('fs-extra');
const { executor, serial, parallel } = require('@flammae/task');
const {
    appEntryJsFile,
    appIndexJsFile,
    appFlammaeDir,
} = require('../fileSchema');
const getResolveApp = require('../shared/getResolveApp');

const init = require('./initTask');
const renterEntry = require('./rendeEntry');
const returnRenderIndexJsFile = require('./renderIndexJsFile');
const returnRenderRouteDataFile = require('./renderRouteDataFile');
const returnRenderFlammaeJsFile = require('./renderFlammaeJsFile');
const returnRenderMdRendererJsFile = require('./renderMdRendererJsFile');

module.exports = function createDynamicEntry(cwd) {
    const resolveApp = getResolveApp(cwd);
    const renderIndexJs = returnRenderIndexJsFile(resolveApp);
    const renderRouteDataFile = returnRenderRouteDataFile(resolveApp);
    const renderFlammaeJsFile = returnRenderFlammaeJsFile(resolveApp);
    const renderMdRendererJsFile = returnRenderMdRendererJsFile(resolveApp);

    const appFlammae = resolveApp(appFlammaeDir);
    const entryPath = resolveApp(appEntryJsFile);
    const indexPath = resolveApp(appIndexJsFile);

    const hasCustomIndex = fs.existsSync(indexPath);
    const tasks = hasCustomIndex
        ? done => done()
        : parallel(
              renderIndexJs,
              renderRouteDataFile,
              renderFlammaeJsFile,
              renderMdRendererJsFile
          );

    executor(
        serial(
            init(appFlammae),
            renterEntry(entryPath),
            tasks,
            renterEntry(
                entryPath,
                `export { * as default } from ${
                    hasCustomIndex ? '../index' : './index'
                }`
            )
        )
    );

    return entryPath;
};
