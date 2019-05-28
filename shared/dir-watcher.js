const fs = require('fs');
const path = require('path');

/**
 * 监听文件夹内部操作
 */
function watchDir(dirPath, listener) {
    /**
     * 检测路径 存在 且 为文件
     */
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
    }
    catch (err) {
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
        // 有的系统可能不传filename
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
            }
            return null;
        }, map);

        const isPathExists = target && fs.existsSync(path.resolve(dirPath, target.path));
        const isDir = target && target.isDirectory();

        /**
         * filename：任意，eventType: rename
         *
         * 对于rename事件，文件跟文件夹是相同的
         */
        if (eventType === 'rename') {
            /**
             * 路径存在，即，创建
             */
            if (isPathExists) {
                lastObj[lastName] = fs.statSync(target.path);
                const type = isDir ? 'mkdir' : 'createFile';
                callback(type, target.path);
            }
            // 删除
            else {
                delete lastObj[lastName];
                const type = isDir ? 'rmdir' : 'deleteFile';
                callback(type, target.path);
            }
            return;
        }

        /**
         * filename：文件，eventType: change
         */
        if (!isDir) {
            callback('change', target.path);
            return;
        }

        /**
         * filename：文件夹，eventType: change
         *
         * 可能的情况：
         * - 在文件夹中新建文件或文件夹
         * - 删除文件夹内文件或文件夹
         * - 重命名文件夹
         *
         */

        /**
         * 之前不存在这个文件夹，即，重命名
         */
        if (!target) {
            // disable
        }
        /**
         * 判断是否文件夹多了一个文件或文件夹，即，新建文件或文件夹
         */
        else if (!lastObj[target]) {
            //
        }

        /**
         * 删除文件或文件夹，啥都不用做
         */
    };
}

module.exports = watchDir;
module.exports.getDirMap = getDirMap;
