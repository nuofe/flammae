/**
 * Author: L.S <fitz-i@foxmail.com>
 */

const fs = require('fs-extra');
const parseFiles = require('./file-parse');
const {
    appRoot,
    appCacheTemp,
    resolveAppSrc,
} = require('../shared/paths');
const {
    getFilePaths,
} = require('../shared/utils');
const runWebpack = require('../webpack/index');
const writeFlammeModuleFileSync = require('./write-flammae');
const writeTempAppFileSync = require('./write-temp-app');
const writeTempIndexFileSync = require('./write-temp-index');
const writeTempSiteDataFileSync = require('./write-temp-site-data');
const watchFile = require('./watch-file');

const pattern = function pattern(filePath) {
    return filePath.match(/.*\.(jsx|md)$/);
};


// 第一步
//
// 确保appRoot/src 目录存在
// 确保appRoot/node_modules/.cache/flammae存在
console.log();
console.log('初始化...');
fs.emptyDirSync(appCacheTemp);
// fs.ensureDirSync(appRoot);


// 第二步
const docDir = resolveAppSrc('docs');
const pageDir = resolveAppSrc('pages');
const filePaths = [...getFilePaths(docDir, pattern), ...getFilePaths(pageDir, pattern)];

parseFiles(filePaths).then((siteData) => {
    // 写文件
    console.log();
    console.log('正在写入数据...');
    writeFlammeModuleFileSync();
    writeTempIndexFileSync();
    writeTempAppFileSync(siteData);
    writeTempSiteDataFileSync(siteData);
    // 监听文件添加修改
    watchFile(appRoot);
    console.log();
    console.log('启动webpack...');
    const mode = process.argv[2].slice(1);
    runWebpack(mode);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
