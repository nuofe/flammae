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
    writeFlammeModuleFileSync,
    writeGlobalStylesSync,
    writeTempRoutesFileSync,
    writeTempSiteDataFileSync,
    renderMarkdownRenderHoc,
} = require('./render-files');

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
    writeFlammeModuleFileSync();
    writeTempSiteDataFileSync();
    writeGlobalStylesSync();
    writeTempRoutesFileSync();
    renderMarkdownRenderHoc(getModulesPathMap());

    // 从根目录开始创建一个fsMap
    const fsMap = createFsMap(appRoot);

    /**
     * 读取 .theme\\styles\\*.{css,less,scss}
     * 将样式数据写入 index.js
     */
    const getGlobalStylesDataAndWriteFiles = () => {
        const stylePaths = getStylesData(fsMap);
        writeGlobalStylesSync(stylePaths);
    };

    /**
     * 读取并分析文件夹获取路由数据，写入routes.jsx文件
     */
    const getRoutesDataAndWriteInFiles = (callback = () => null) => {
        getRoutesData(fsMap).then((files) => {
            const siteData = parseRouteFiles(files);
            writeTempRoutesFileSync(siteData);
            writeTempSiteDataFileSync(siteData);
            callback();
        }).catch((err) => {
            console.log(err);
            process.exit(1);
        });
    };

    getGlobalStylesDataAndWriteFiles();

    getRoutesDataAndWriteInFiles(() => {
        fsMap.watch({

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
                renderMarkdownRenderHoc(getModulesPathMap());
            },
        });
    });

    return appTempIndex;
};
