const fs = require('fs-extra');
const path = require('path');

module.exports = {
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
