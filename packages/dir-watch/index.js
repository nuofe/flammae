const fs = require('fs');
const path = require('path');
const createFsMap = require('./fs-map/create-fs-map');

/**
 * 监听文件夹内部操作
 */
function watchDir(absDirPath, listener) {
    /**
     * 检测路径 存在 且 为文件
     */
    const fsMap = createFsMap(absDirPath);

    fs.watch(
        absDirPath, {
            encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
            recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
            persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
        },
        listenerFactory(fsMap, listener),
    );
}

/**
 *
 *
 */
function listenerFactory(fsMap, callback) {
    // listener 接收两个参数 eventType filename
    // eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
    return function listener(eventType, filename) {
        // 有的系统可能不传filename
        if (!filename) {
            console.log('unknown file change');
            return;
        }

        const [target, parent] = fsMap.traverse(filename);

        const isPathExists = target && fs.existsSync(target.absPath);
        const isDir = target && target.isDirectory;

        /**
         * filename：任意，eventType: rename
         * 创建跟删除会触发 rename 事件
         * 对于rename事件，文件跟文件夹是相同的
         */
        if (eventType === 'rename') {
            /**
             * 路径存在，即，创建
             */
            if (isPathExists) {
                parent.make(filename);
                const eType = isDir ? 'mkDir' : 'mkFile';
                callback(eType, target.absPath);
            }
            // 删除
            else {
                target.remove();
                const eType = isDir ? 'rmDir' : 'rmFile';
                callback(eType, target.absPath);
            }
            return;
        }

        /**
         * filename：文件，eventType: change
         *
         * 修改文件内容
         */
        if (!isDir) {
            callback('fileChange', target.absPath);
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
