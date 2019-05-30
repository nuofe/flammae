const fs = require('fs-extra');
const {
    appStylesDir,
    templateIndexTpl,
    tempIndexJs,
} = require('./paths');
const {
    getFilePaths,
    resolvePath,
} = require('../shared/utils');
const viewGen = require('../packages/tpl-engine');

/**
 * 在项目的**node_modules/.cache/flammae/temp**文件夹下创建**index.js**文件，
 * 如果项目目录下存在**styles**文件夹，则将其中的样式文件都写入**index.js**
 */
module.exports = function writeTempIndexFileSync() {
    // 读取模板 index.js, 项目入口文件
    const indexTplText = fs.readFileSync(templateIndexTpl, {
        encoding: 'utf8',
    });
    // 读取所有自定义样式文件
    const stylePaths = getFilePaths(appStylesDir).map(path => resolvePath(path));
    // 生成index.js文本
    const indexText = viewGen(indexTplText, { stylePaths });
    // 写入 appRoot/node_modules/.cache/flammae/temp/index.js
    fs.writeFileSync(tempIndexJs, indexText);
};
