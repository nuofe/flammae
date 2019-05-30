const path = require('path');
const isObject = require('./utils/is-object');
const normalizeFilename = require('./utils/normalize-filename');

/**
 *
 * @return {array|string}
 */
module.exports = function traverse(filename, fsMap, visitor) {
    // TODO: fsMap 类型校验
    if (!fsMap || !filename) {
        return null;
    }

    /**
     * 标准化filename, 错误处理
     */
    const normalizedPath = normalizeFilename(filename);

    if (visitor && !isObject(visitor)) {
        throw TypeError('visitor must be a plain object');
    }

    const ensureAbsFilename = path.resolve(filename);
    if (ensureAbsFilename.indexOf(fsMap.absPath) === -1) {
        throw Error('the filename you traversed have nothing to do with the fsMap which you gave');
    }

    /**
     * - c:\\a\\b
     * - \a\b\c
     * - a/b/c
     */
    const paths = normalizedPath.split(/\\\\|\\|\//);

    if (!paths.length) {
        return null;
    }

    /**
     * 用于存放每一个遍历到的节点，顺序 新 -> 旧
     */
    const fsNodeList = [];

    /**
     * 当前正在遍历的节点文件名
     */
    let curFilename = paths[0];

    /**
     * 当前正在遍历的节点的父节点
     */
    let subFsMap = null;

    /**
     * 用来中止traveser的函数
     */
    let shouldBreak = false;
    const breakTraverse = function breakTraverse() {
        shouldBreak = true;
    };

    do {
        // eslint-disable-next-line no-loop-func
        const statsOrDirent = (subFsMap || fsMap).filter(item => item.name === curFilename)[0];

        if (statsOrDirent) {
            subFsMap = statsOrDirent.children ? statsOrDirent.children : statsOrDirent;

            /**
             * 记录每一个遍历到的节点，顺序 新 -> 旧
             */
            fsNodeList.unshift(statsOrDirent);
        }

        if (visitor[curFilename]) {
            /**
             * 执行visitor
             */
            visitor[curFilename](statsOrDirent, breakTraverse);

            /**
             * 如果用户在visitor中调用了done, 则停止整个traverse
             */
            if (shouldBreak) {
                break;
            }
        }
        path.shift();
        [curFilename] = paths;
    } while (curFilename);

    return fsNodeList;
};
