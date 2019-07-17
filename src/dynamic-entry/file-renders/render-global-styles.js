const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const {
    appTempIndex,
    appIndexFileTpl,
} = require('../../paths');

/**
 * 在项目的 **.flammae** 文件夹下创建**index.js**文件，
 * 如果项目目录下存在**styles**文件夹，则将其中的样式文件都写入**index.js**
 */
module.exports = function writeGlobalStyles(stylePaths = []) {
    // 读取模板 index.js, 项目入口文件
    const indexTplText = fs.readFileSync(appIndexFileTpl, {
        encoding: 'utf8',
    });
    // 生成index.js文本
    const indexText = render(indexTplText, { stylePaths });
    // 写入 appRoot/node_modules/.cache/flammae/index.js
    fs.writeFileSync(appTempIndex, indexText);
};
