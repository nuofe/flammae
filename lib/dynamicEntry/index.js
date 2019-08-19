'use strict';

/* eslint-disable camelcase */
const fs = require('fs-extra');
const { executor, serial, parallel } = require('@flammae/task');
const { appEntryJsFile, appIndexJsFile } = require('../fileSchema');
const getResolveApp = require('../shared/getResolveApp');

const init = require('./initTask');
const writeRealIndexJsFile = require('./writeRealIndexJsFile');
const returnWriteIndexJsFile = require('./writeIndexJsFile');
const returnWriteRouteDataFile = require('./writeRouteDataFile');
const returnWriteFlammaeJsFile = require('./writeFlammaeJsFile');
const returnWriteMdRendererJsFile = require('./writeMdRendererJsFile');
const returnCopyRouterFile = require('./copyRouterFile');

module.exports = function createDynamicEntry(cwd) {
    const resolveApp = getResolveApp(cwd);
    const writeIndexJsFile = returnWriteIndexJsFile(cwd);
    const writeRouteDataJsFile = returnWriteRouteDataFile(cwd);
    const writeFlammaeJsFile = returnWriteFlammaeJsFile(cwd);
    const writeMdWriteerJsFile = returnWriteMdRendererJsFile(cwd);
    const copyRouterFile = returnCopyRouterFile(cwd);

    const entryPath = resolveApp(appEntryJsFile);
    const indexPath = resolveApp(appIndexJsFile);

    const hasCustomIndex = fs.existsSync(indexPath);

    /**
     * 当存在index.js时，不需要执行：
     * - 生成index.js文件
     * - 生成router.jsx文件
     *
     */

    executor(
        serial(
            init(cwd),
            writeRealIndexJsFile(entryPath, ''),
            writeRouteDataJsFile,
            writeMdWriteerJsFile,
            writeFlammaeJsFile,
            parallel(
                hasCustomIndex ? done => done() : writeIndexJsFile,
                hasCustomIndex ? done => done() : copyRouterFile
            ),
            writeRealIndexJsFile(
                entryPath,
                `export { * as default } from ${
                    hasCustomIndex ? '../index' : './index'
                }`
            )
        )
    );

    return entryPath;
};
