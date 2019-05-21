const fs = require('fs');
const path = require('path');
const { debounce } = require('./utils');

/**
 * 监听文件夹内部操作
 */
function watchDir(dirPath, listener) {
    // 检测路径 存在 且 为文件

    const map = getDirMap(dirPath);

    fs.watch(
        dirPath, {
            encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
            recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
            persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
        },
        listenerFactory(map, dirPath, listener),
    );
}

/**
 * 读取文件夹，生成一份map
 * {
 *     f1: 'dirent',
 *     d1: 'dirent'
 *      |---children: {}
 * }
 */
function getDirMap(dirPath) {
    let direntList = [];
    try {
        direntList = fs.readdirSync(dirPath, {
            encoding: 'utf8',
            withFileTypes: true,
        });
    } catch (err) {
        throw err;
    }

    const dirMap = {};

    direntList.forEach((dirent) => {
        const entirePath = path.join(dirPath, dirent.name);
        dirMap[dirent.name] = dirent;
        dirMap[dirent.name].path = entirePath;
        if (dirent.isDirectory()) {
            dirMap[dirent.name].children = getDirMap(entirePath);
        }
    });

    return dirMap;
}

/**
 *
 *
 */
function listenerFactory(map, dirPath, callback) {
    // listener 接收两个参数 eventType filename
    // eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
    return function listener(eventType, filename) {
        if (!filename) {
            console.log('unknown file change');
            return;
        }
        const paths = filename.split(path.sep);
        let lastObj = null;
        let lastName = '';
        const target = paths.reduce((obj, curFileName) => {
            lastObj = obj;
            lastName = curFileName;
            const statsOrDirent = obj[curFileName];
            if (statsOrDirent) {
                return statsOrDirent.children ? statsOrDirent.children : statsOrDirent;
            } else { /* eslint-disable-line */
                // 重命名了
                return null;
            }
        }, map);

        if (target.isDirectory()) {
            /* eslint-disable */
            if (eventType === 'change') {

            } else {
                // rename

            }
            /* eslint-enable */
        } else if (eventType === 'change') {
            callback('change', target.path);
        } else if (eventType === 'rename') {
            if (fs.existsSync(path.resolve(dirPath, target.path))) {
                lastObj[lastName] = fs.statSync(target.path);
                callback('createFile', target.path);
            } else {
                delete lastObj[lastName];
                callback('deleteFile', target.path);
            }
        }
    };
}

module.exports = watchDir;
module.exports.getDirMap = getDirMap;
