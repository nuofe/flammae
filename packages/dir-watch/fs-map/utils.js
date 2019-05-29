const fs = require('fs');

/**
 * 读取文件夹第一级目录内文件列表，生成dirent数组
 */
exports.readdirSync = function readdirSync(dirPath, options) {
    try {
        return fs.readdirSync(dirPath, options);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
        return null;
        // throw err;
    }
};
