const { pathExistSync, sepToModuleSystem } = require('@flammae/helpers');
const { appCompOverrideFile, appAppCompTemplateFile } = require('../../paths');

// TODO: 优化
module.exports = function getAppFilePath() {
    return pathExistSync(appCompOverrideFile)
        ? sepToModuleSystem(appCompOverrideFile)
        : sepToModuleSystem(appAppCompTemplateFile);
};
