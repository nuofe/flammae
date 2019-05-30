const path = require('path');
const isObject = require('./utils/is-object');
const normalizeFilename = require('./utils/normalize-filename');

/**
 *
 * @return {array|string}
 */
module.exports = function find(absPath, fsMap, visitor) {
    // TODO: fsMap 类型校验
    if (!fsMap || !absPath) {
        return null;
    }

    if (typeof absPath !== 'string') {
        throw TypeError(`expects an argument of type string, but got a\\an ${typeof absPath}`);
    }

    if (!path.isAbsolute(absPath)) {
        throw TypeError(`path '${absPath}' must be absolute`);
    }

    if (visitor && !isObject(visitor)) {
        throw TypeError('visitor must be a plain object');
    }

    /**
     * resolve path
     * path.resolve can also do normalize
     */
    const ensureAbsPath = path.resolve(absPath);
    if (ensureAbsPath.indexOf(fsMap.absPath) === -1) {
        throw Error(
            `the absolute path (${ensureAbsPath}) you traversed, \n`
            + `       have nothing to do with the fsMap.absPath (${fsMap.absPath}) you gave.\n`,
        );
    }
    const sortPath = ensureAbsPath.replace(fsMap.absPath, '');

    /**
     *
     * - c:\\a\\b
     * - \a\b\c
     * - a/b/c
     */
    const splitReg = /\\\\|\\|\//;
    const normalizedPath = normalizeFilename(sortPath).replace(splitReg, '');
    const filenameArr = normalizedPath.split(splitReg);

    /**
     * 如果filenameArr.length === 0, 即 absPath === fsMap.absPath
     */

    if (!filenameArr.length) {
        return {
            type: 'found',
            result: [fsMap],
        };
    }

    /**
     * 用于存放每一个遍历到的节点，顺序 新 -> 旧
     */
    const result = [];
    let found = true;
    let fsNodes = fsMap.children;
    let i = 0;
    const { length } = filenameArr;
    for (; i < length; i += 1) {
        /**
         * 找到文件名对应的文件节点
         */
        const filename = filenameArr[i];
        const fsNode = fsNodes.find(fsNodeItem => fsNodeItem.name === filename);

        /**
         * 如果文件节点不存在，就终止本次查找
         */
        if (!fsNode) {
            if (i !== length - 1) {
                // not found
                found = false;
            }
            break;
        }
        result.unshift(fsNode);
        fsNodes = fsNode.children;
    }

    return {
        result,
        type: found ? 'found' : 'notFound',
    };
};
