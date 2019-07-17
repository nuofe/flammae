const fs = require('fs-extra');
const createFsMap = require('@flammae/fs-map');
const {
    pathExistSync,
    sepToModuleSystem,
} = require('@flammae/helpers');
const FileRender = require('./render');
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

class DynamicEntryRender extends FileRender {
    constructor() {
        // 初始化
        fs.ensureDirSync(appCache);

        this.state = {
            siteData: {
                docs: [],
                pages: [],
            },
            modulePathMap: getModulesPathMap(),
            stylePaths: [],
        };

        fs.ensureDirSync(appCache);
        this.fsMap = createFsMap(appRoot);

        return appTempIndex;
    }

    didRender() {
        this.getStylesData();
        this.getRoutesData();
        this.fsMap.watch({
            /**
             * TODO: 不准确
             * 路由
             */
            '{/docs,/docs/**,/docs/**/*.md,/.theme/pages,/.theme/pages/**,/.theme/pages/*/**/index.jsx}': () => {
                this.getRoutesData();
            },

            /**
             * 主题样式
             */
            '/.theme/styles,.theme/styles/*.{less,css,scss,sass}': () => {
                this.getStylesData();
            },

            '/.theme': () => {
                this.getStylesData();
                this.getRoutesData();
            },

            /**
             * 主题模板
             */
            '/.theme/templates/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {
                this.setState({
                    stylePaths: getModulesPathMap(),
                });
            },
        });
    }
    getRoutesData() {
        getRoutesData(this.fsMap).then((files) => {
            const siteData = parseRouteFiles(files);
            this.setState({
                siteData,
            });
        }).catch((err) => {
            console.log(err);
            process.exit(1);
        });
    }
    getStylesData() {
        const stylePaths = getStylesData(this.fsMap);
        this.setState({
            stylePaths,
        });
    }

    render() {
        const {
            siteData,
            stylePaths,
            modulePathMap,
        } = this.state;

        renderFlammae();
        renderRoutes(siteData);
        renderSiteDataJson(siteData);
        renderMarkdownRenderer(modulePathMap);
        renderGlobalStyles(stylePaths);
    }
}

module.exports = function createDynamicEntry() {
    return new DynamicEntryRender();
};
