const fs = require('fs-extra');
const createFsMap = require('@flammae/fs-map');
const memoizeOne = require('memoize-one');
const FileRender = require('./file-render');
const {
    getStylesData,
    getRoutesData,
    getModulesPathMap,
} = require('./models');
const parseRouteFiles = require('./parse-route-files');
const {
    appRoot,
    appCache,
} = require('../paths');
const {
    renderFlammae,
    renderGlobalStyles,
    renderMarkdownRenderer,
    renderRoutes,
    renderSiteDataJson,
} = require('./file-renders');

const memoRenderFlammae = memoizeOne(renderFlammae);
const memoRenderGlobalStyles = memoizeOne(renderGlobalStyles);
const memoRenderMarkdownRenderer = memoizeOne(renderMarkdownRenderer);
const memoRenderRoutes = memoizeOne(renderRoutes);
const memoRenderSiteDataJson = memoizeOne(renderSiteDataJson);

module.exports = class DynamicEntryRender extends FileRender {
    constructor() {
        super();
        fs.ensureDirSync(appCache);
        this.state = {
            siteData: {
                docs: [],
                pages: [],
            },
            modulePathMap: getModulesPathMap(),
            stylePaths: [],
        };

        this.fsMap = createFsMap(appRoot);
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

        memoRenderFlammae();
        memoRenderRoutes(siteData);
        memoRenderSiteDataJson(siteData);
        memoRenderMarkdownRenderer(modulePathMap);
        memoRenderGlobalStyles(stylePaths);
    }
};
