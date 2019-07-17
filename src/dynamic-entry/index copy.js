const fs = require('fs-extra');
const createFsMap = require('@flammae/fs-map');
const {
    pathExistSync,
    sepToModuleSystem,
} = require('@flammae/helpers');
const getRoutesData = require('./models/get-routes-data');
const getStylesData = require('./models/get-styles-data');
const parseRouteFiles = require('./controllers/handle-routes');
const {
    appRoot,
    appCache,
    appTempIndex,
    contentTplComponent,
    customContentComponent,
    markdownTplComponent,
    customDemoComponent,
    deomTplComponent,
} = require('../paths');
const {
    renderFlammae,
    renderGlobalStyles,
    renderMarkdownRenderer,
    renderRoutes,
    renderSiteDataJson,
} = require('./file-renders');


class DynamicEntry {
    constructor() {
        fs.ensureDirSync(appCache);
        renderFlammae();
        renderSiteDataJson();
        renderGlobalStyles();
        renderRoutes();
        renderMarkdownRenderer(getModulesPathMap());

        // 从根目录开始创建一个fsMap
        this.fsMap = createFsMap(appRoot);
        return appTempIndex;
    }

    watch() {
        this.fsMap.watch({

            /**
             * TODO: 不准确
             * 路由
             */
            '{/docs,/docs/**,/docs/**/*.md,/.theme/pages,/.theme/pages/**,/.theme/pages/*/**/index.jsx}': () => {
                getRoutesDataAndWriteInFiles();
            },

            /**
             * 主题样式
             */
            '/.theme/styles,.theme/styles/*.{less,css,scss,sass}': () => {
                getGlobalStylesDataAndWriteFiles();
            },

            '/.theme': () => {
                getGlobalStylesDataAndWriteFiles();
                getRoutesDataAndWriteInFiles();
            },

            /**
             * 主题模板
             */
            '/.theme/templates/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {
                renderMarkdownRenderer(getModulesPathMap());
            },
        });
    }
    render() {

    }
}


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
