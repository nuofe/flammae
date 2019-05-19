const path = require('path');
const {
    watchFile,
} = require('./utils');
const writeTempIndexFileSync = require('./write-temp-index');
const writeTempAppFileSync = require('./write-temp-app');


module.exports = function watchAppDir(filename) {
    watchFile(filename, (eventType, shorPath) => {
        // eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
        // 在大多数平台上，每当文件名在目录中出现或消失时，就会触发 'rename' 事件。
        if (!shorPath) {
            console.log();
            console.log('unknown file change');
            return;
        }
        const dirName = shorPath.split(path.sep)[0];
        if (dirName === 'templates') {
            writeTempAppFileSync();
        } else if (dirName === 'styles') {
            writeTempIndexFileSync();
        } else if (['docs', 'pages'].includes(dirName)) {
            // siteData[dirName] = [];
            // 这里可以做diff优化
            // parseFiles(getFilePaths(resolveAppSrc(dirName), pattern));
        }
    });
};
