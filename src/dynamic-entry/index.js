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

module.exports = function createDynamicEntry() {
    // 初始化
    fs.ensureDirSync(appCache);
    renderFlammae();
    renderSiteDataJson();
    renderGlobalStyles();
    renderRoutes();
    renderMarkdownRenderer(getModulesPathMap());


    /**
     * 读取 .theme\\styles\\*.{css,less,scss}
     * 将样式数据写入 index.js
     */
    const getGlobalStylesDataAndWriteFiles = () => {
        const stylePaths = getStylesData(fsMap);
        renderGlobalStyles(stylePaths);
    };

    /**
     * 读取并分析文件夹获取路由数据，写入routes.jsx文件
     */
    const getRoutesDataAndWriteInFiles = (callback = () => null) => {
        getRoutesData(fsMap).then((files) => {
            const siteData = parseRouteFiles(files);
            renderRoutes(siteData);
            renderSiteDataJson(siteData);
            callback();
        }).catch((err) => {
            console.log(err);
            process.exit(1);
        });
    };

    getGlobalStylesDataAndWriteFiles();

    getRoutesDataAndWriteInFiles(() => {

    });

    return appTempIndex;
};


class Render() {
    constructor() {

    }

    render() {

    }
}