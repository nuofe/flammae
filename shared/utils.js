const fs = require('fs-extra');
const path = require('path');

module.exports = {
    watchFile,
    readFiles,
    resolvePath,
    getFilePaths,
    debounce,
    pathExistSync,
};


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


/**
 * 读取文件
 * @param {array|string} filePaths
 */
function readFiles(filePaths) {
    let filePathList = filePaths;
    // normalize filePaths => []
    if (typeof filePathList === 'string') {
        filePathList = [filePathList];
    }
    const readFileProcesses = filePathList.map(filePath => (
        new Promise((resolve, reject) => {
            fs.readFile(
                filePath, {
                    encoding: 'utf8',
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            data,
                            path: filePath,
                        });
                    }
                },
            );
        })
    ));

    return Promise.all(readFileProcesses);
}


/**
 * 将系统路径转换成js 模块可以加载的路径
 * D:\flammae\root\src =>  D:/flammae/root/src
 * @param {string} path
 */
function resolvePath(p) {
    return p.split(path.sep).join('/');
}


/**
 *
 * 读取指定文件夹，返回所有的文件的 **绝对路径** 组成的数组，
 * 可通过校验函数判断路径是否符合需求，不满足的不返回
 *
 * @param {string} dir 目标文件夹
 * @param {function} pathValidator 接受文件路径作为参数。可对路径进行解析，并返回Boolean类型值
 *                            如果pathValidator返回 true，该路径将最终被 getFilePaths返回，否则不返回
 *
 */
function getFilePaths(dir, pathValidator = () => true) {
    let filesPaths = [];
    // 读取目标文件夹内的内容
    const direntArr = fs.existsSync(dir)
        ? fs.readdirSync(dir, {
            withFileTypes: true,
        })
        : null;

    if (!direntArr || !direntArr.length) {
        return [];
    }
    direntArr.forEach((dirent) => {
        const absolutePath = path.resolve(dir, dirent.name);

        if (dirent.isFile()) {
            // 文件
            if (pathValidator(absolutePath) === false) {
                return;
            }
            filesPaths.push(absolutePath);
        } else if (dirent.isDirectory()) {
            // 文件夹
            filesPaths = filesPaths.concat(getFilePaths(absolutePath, pathValidator));
        }
    });
    return filesPaths;
}


/**
 * 判断**给定的路径是否存在**，无论是文件夹还是指定的文件
 * @param {string} targetPath 目标路径
 * @param {array} suffixs 文件后缀名
 */
function pathExistSync(targetPath, suffixs = ['.jsx', '.js']) {
    if (fs.existsSync(targetPath)) {
        return true;
    }
    return suffixs.some((suffix) => {
        try {
            const file = fs.statSync(targetPath + suffix);
            return file && file.isFile();
        } catch (err) {
            return false;
        }
    });
}

/**
 * 监听文件 创建修改
 * 这里可能导致bug， writeFile会重新触发 watchFile。目前用 debounce 解决
 */
function watchFile(filename, callback) {
    // listener 接收两个参数 eventType filename
    // eventType 是 'rename' 或 'change'， filename 是触发事件的文件的名称。
    // 在大多数平台上，每当文件名在目录中出现或消失时，就会触发 'rename' 事件。
    const debouncedListener = debounce(callback);
    fs.watch(
        filename, {
            encoding: 'utf8', // 指定用于传给监听器的文件名的字符编码
            recursive: true, // 指示应该监视所有子目录，还是仅监视当前目录，仅在 macOS 和 Windows 上有效
            persistent: true, // 指示如果文件已正被监视，进程是否应继续运行
        },
        debouncedListener,
    );
}
