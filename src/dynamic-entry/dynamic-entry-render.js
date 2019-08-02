const fs = require('fs-extra');
const memoizeOne = require('memoize-one');
const createFsMap = require('@flammae/fs-map');
const FileRender = require('./file-render');
const parseRouteFiles = require('./parse-route-files');
const { appRoot, appCache } = require('../paths');
const {
    getStylesData,
    getRoutesData,
    getModulesPathMap,
    getAppFilePath,
} = require('./models');
const {
    renderFlammae,
    renderAppEntry,
    renderMarkdownRenderer,
    renderRouteData,
    renderSiteDataJson,
} = require('./file-renders');

const memoRenderAppEntry = memoizeOne(renderAppEntry);
const memoRenderMarkdownRenderer = memoizeOne(renderMarkdownRenderer);
const memoRenderRoutes = memoizeOne(renderRouteData);
const memoRenderSiteDataJson = memoizeOne(renderSiteDataJson);

module.exports = class DynamicEntryRender extends FileRender {
    constructor() {
        super();
        this.state = {
            siteData: {
                docs: [],
                pages: [],
            },
            modulePathMap: getModulesPathMap(),
            stylePaths: [],
            appFilePath: getAppFilePath(),
        };

        this.fsMap = createFsMap(appRoot);

        fs.ensureDirSync(appCache);
        renderFlammae();
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
            '/.theme/override/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {
                this.setState({
                    stylePaths: getModulesPathMap(),
                });
            },
            './.theme/override/{app.jsx,app/index.jsx}': () => {
                this.setState({
                    appFilePath: getAppFilePath(),
                });
            },
        });
    }

    getRoutesData() {
        getRoutesData(this.fsMap)
            .then(files => {
                const siteData = parseRouteFiles(files);
                this.setState({
                    siteData,
                });
            })
            .catch(err => {
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
        const { siteData, stylePaths, modulePathMap, appFilePath } = this.state;

        memoRenderRoutes(siteData);
        memoRenderSiteDataJson(siteData);
        memoRenderMarkdownRenderer(modulePathMap);
        memoRenderAppEntry(stylePaths, appFilePath);
    }
};
