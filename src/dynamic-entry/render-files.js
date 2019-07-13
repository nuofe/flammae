const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const {
    flammae,
    appTempDataFile,
    appTempIndex,
    appIndexFileTpl,
    routesFileTpl,
    appTempRoute,
    markdownRenderTpl,
    appTempMarkdownRender,
} = require('../paths');


/**
 * 在项目的 **.flammae** 文件夹下生成**flammae.js**文件，
 * 这样在项目中可以通过 `import{ siteData } from 'flammae';` 来获取所有数据
 */
exports.writeFlammeModuleFileSync = function writeFlammeModuleFileSync() {
    const code = 'export {default as siteData} from \'./site-data.json\';';
    fs.writeFileSync(flammae, code);
};


exports.writeTempRoutesFileSync = function writeTempRoutesFileSync(
    siteData = { docs: [], pages: [] },
) {
    try {
        // 读取 模板 routes.jsx 文件
        const routesTplText = fs.readFileSync(routesFileTpl, { encoding: 'utf8' });
        // 生成文本
        const routesText = render(routesTplText, {
            siteData,
        });
        // 写入 .flammae/routes.jsx
        fs.writeFileSync(appTempRoute, routesText);
    } catch (err) {
        throw new Error(err);
    }
};

exports.renderMarkdownRenderHoc = function renderMarkdownRenderHoc(
    modulesPathMap,
) {
    try {
        const markdownRenderTplText = fs.readFileSync(markdownRenderTpl, { encoding: 'utf8' });
        // 生成文本
        const renderText = render(markdownRenderTplText, modulesPathMap);
        // 写入 .flammae/markdown-render.jsx
        fs.writeFileSync(appTempMarkdownRender, renderText);
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * 在项目的 **.flammae** 文件夹下创建**index.js**文件，
 * 如果项目目录下存在**styles**文件夹，则将其中的样式文件都写入**index.js**
 */
exports.writeGlobalStylesSync = function writeGlobalStylesSync(stylePaths = []) {
    // 读取模板 index.js, 项目入口文件
    const indexTplText = fs.readFileSync(appIndexFileTpl, {
        encoding: 'utf8',
    });
    // 生成index.js文本
    const indexText = render(indexTplText, { stylePaths });
    // 写入 appRoot/node_modules/.cache/flammae/index.js
    fs.writeFileSync(appTempIndex, indexText);
};


/**
 * 在项目 **.flammae** 文件夹下写入**site-data.json**文件，
 * 该文件包含所有该项目的全局数据
 */
exports.writeTempSiteDataFileSync = function writeTempSiteDataFileSync(
    siteData = { docs: [], pages: [] },
) {
    // 向 site-data.json文件中存入静态数据
    fs.writeFileSync(appTempDataFile, JSON.stringify(siteData));
};
