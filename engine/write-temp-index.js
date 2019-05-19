const fs = require('fs-extra');
const {
    appStylesDir,
    templateIndexJsx,
    tempIndexJs,
} = require('./paths');
const {
    getFilePaths,
    resolvePath,
} = require('./utils');
const {
    insertImport,
} = require('./write-temp-app');

/**
 * 在项目的**node_modules/.cache/flammae/temp**文件夹下创建**index.js**文件，
 * 如果项目目录下存在**styles**文件夹，则将其中的样式文件都写入**index.js**
 */
module.exports = function writeTempIndexFileSync() {
    // 读取所有自定义样式文件
    const stylePaths = getFilePaths(appStylesDir);
    // 读取模板 index.js, 项目入口文件
    let indexFileText = fs.readFileSync(templateIndexJsx, {
        encoding: 'utf8',
    });
    // 向 index.js 中写入全局样式引用
    stylePaths.forEach((stylePath) => {
        indexFileText = insertImport(indexFileText, resolvePath(stylePath));
    });
    // 生成 index.js 临时文件
    fs.writeFileSync(tempIndexJs, indexFileText);
};
