const { pathExistSync, sepToModuleSystem } = require('@flammae/helpers');
const {
    contentTplComponent,
    contentCompOverrideFile,
    markdownTplComponent,
    demoCompOverrideFile,
    deomTplComponent,
} = require('../../paths');

// TODO: 优化
function getModulesPathMap() {
    return {
        // content 组件路径
        content: pathExistSync(contentCompOverrideFile)
            ? sepToModuleSystem(contentCompOverrideFile)
            : sepToModuleSystem(contentTplComponent),

        demo: pathExistSync(demoCompOverrideFile)
            ? sepToModuleSystem(demoCompOverrideFile)
            : sepToModuleSystem(deomTplComponent),

        // markdown 组件
        markdown: sepToModuleSystem(markdownTplComponent),
    };
}

module.exports = getModulesPathMap;
