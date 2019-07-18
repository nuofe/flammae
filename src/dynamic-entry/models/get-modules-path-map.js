const {
    pathExistSync,
    sepToModuleSystem,
} = require('@flammae/helpers');
const {
    contentTplComponent,
    customContentComponent,
    markdownTplComponent,
    customDemoComponent,
    deomTplComponent,
} = require('../../paths');

// TODO: 优化
function getModulesPathMap() {
    return {
        // content 组件路径
        content: pathExistSync(customContentComponent)
            ? sepToModuleSystem(customContentComponent)
            : sepToModuleSystem(contentTplComponent),

        demo: pathExistSync(customDemoComponent)
            ? sepToModuleSystem(customDemoComponent)
            : sepToModuleSystem(deomTplComponent),

        // markdown 组件
        markdown: sepToModuleSystem(markdownTplComponent),
    };
}

module.exports = getModulesPathMap;
