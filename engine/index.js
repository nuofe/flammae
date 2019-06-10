/**
 * Author: L.S <fitz-i@foxmail.com>
 */

const fs = require('fs-extra');
const parseFiles = require('./file-parse');
const paths = require('../shared/paths');
const utils = require('../shared/utils');
const runWebpack = require('../webpack/index');
const writeFlammeModuleFileSync = require('./write-flammae');
const writeTempAppFileSync = require('./write-temp-app');
const writeTempIndexFileSync = require('./write-temp-index');
const writeTempSiteDataFileSync = require('./write-temp-site-data');
const watchFile = require('./watch-file');
const createFsMap = require('../packages/fs-map');

const pattern = function pattern(filePath) {
    return filePath.match(/.*\.(jsx|md)$/);
};

const {
    getFilePaths,
} = utils;
const {
    appRoot,
    appDocs,
    appCacheTemp,
    resolveApp,
} = paths;

// 第一步
//
// 确保appRoot/docs 目录存在
// 确保appRoot/node_modules/.cache/flammae存在
console.log();
console.log('初始化...');
fs.emptyDirSync(appCacheTemp);
fs.ensureDirSync(appDocs);


// 第二步
const fsMap = createFsMap(appRoot, (node) => {
    if (node.isDirectory) {
        let arr = [];
        node.children.forEach((child) => {
            const result = child.hook();
            if (child.isDirectory) {
                arr = arr.concat(result);
            } else if (result !== false) {
                arr.push(child.hook());
            }
        });
        return arr;
    }

    if (/\.md$/.test(node.name)) {
        return node.absPath;
    }

    return false;
});

const docDir = resolveApp('docs');
const filePaths = [...getFilePaths(docDir, pattern)];

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
