const fs = require('fs');
const path = require('path');

module.exports = watchDir;

/**
 * 监听文件夹内部操作
 */
function watchDir(dirPath, listener) {
    // 路径不存在
    if (!fs.existsSync(dirPath)) {
        throw ReferenceError('path does not exists');
    }

    // listener 接收两个参数 eventType filename
    // eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
    // 在大多数平台上，每当文件名在目录中出现或消失时，就会触发 'rename' 事件。
    const debouncedListener = debounce(listener);
    fs.watch(
        dirPath, {
            encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
            recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
            persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
        },
        debouncedListener,
    );
}

/**
 * 防抖
 * @param {function} fn
 * @param {number} time
 */
function debounce(fn, time) {
    let timer;
    return function debouncedFunction(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, time || 300);
    };
}
