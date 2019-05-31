const fs = require('fs');
const path = require('path');
const createFsMap = require('./fs-map');

/**
 * 监听文件夹内部操作
 */
function watchDir(absDirPath, listener) {
    if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
    }
    /**
     * 根据给定的dirPath 创建这个文件夹的map
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
        const absPath = path.resolve(fsMap.absPath, filename);
        fsMap.clearDiff(absPath, () => {

        });
    };
}

module.exports = watchDir;
