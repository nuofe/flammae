const fs = require('fs');
const path = require('path');

module.exports = class FsNode {
    constructor(filename, stats, parent, hook) {
        const isDirectory = stats.isDirectory();
        const {
            sortPath,
            root,
            absPath,
            level,
        } = parent;

        this.stats = stats;

        /**
         * 文件唯一标识符
         */
        this.ino = stats.ino;

        /**
         * 类型标识
         */
        this.isDirectory = isDirectory;

        /**
         * 文件名
         */
        this.name = filename;
        this.lastFilename = undefined;

        /**
         * 短路径 /a/b/c
         */
        this.sortPath = root ? path.sep : path.join(sortPath, filename);

        /**
         * 从盘符开始的绝对路径 c:\\a\\b\\c
         */
        this.absPath = root ? absPath : path.join(absPath, filename);

        /**
         * 链路
         */
        this.parent = root ? null : parent;
        this.children = isDirectory ? [] : null;
        this.level = root ? 0 : level + 1;

        this.hook = hook ? hook.bind(this, this) : null;
    }

    /**
     * 监听文件夹内部操作
     */
    watch(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected the listener to be a function.');
        }

        const node = this;
        /**
         * 暂不支持
         */
        if (!node.isDirectory) {
            return;
        }

        fs.watch(
            node.absPath, {
                encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
                recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
                persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
            },
            listenerFactory(node, listener),
        );
    }
};

function listenerFactory(fsMap, callback) {
    /**
     * listener 接收两个参数 eventType filename
     * eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
     *
     * 规则：
     *
     * 顶级目录：
     * - 增删： rename filename
     * - 重命名文件 f => f1：  rename f1 & change f1
     * 在文件夹dir中：比较dir中文件变化
     * - 在文件夹dir中增删文件： change dir & rename  dir/filename
     * - 在文件夹dir中重命名文件 dir/f => dir/f1：  rename dir/f1 & change dir & change dir/f1
     */
    return function listener(e, filename) {
        // 有的系统可能不传filename
        if (!filename) {
            console.log('unknown file change');
            return;
        }

        const filenameArr = filename.split(path.sep);
        const pathLength = filenameArr.length;

        /**
         * 在顶级目录下进行操作
         */
        if (pathLength === 1) {
            fsMap.clearDiff(filenameArr[0], (eventType, ...args) => {
                if (eventType === 'unknown') {
                    return;
                }
                callback(eventType, fsMap, ...args);
            });
        } else if (pathLength > 1) {
            const last = filenameArr.pop();
            const dirName = path.resolve(fsMap.absPath, filenameArr.join(path.sep));
            const dirNode = fsMap.find(dirName).result[0];
            dirNode.clearDiff(last, (eventType, ...args) => {
                if (eventType === 'unknown') {
                    return;
                }
                callback(eventType, fsMap, ...args);
            });
        }
    };
}
