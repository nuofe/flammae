const fs = require('fs');
const path = require('path');
const FsNode = require('./fs-base-node');
const createFsNode = require('./index');
const isObject = require('../utils/is-object');
const createFsMap = require('../index');

/**
 * DirNode
 */
module.exports = class DirNode extends FsNode {
    /**
     * make file or dir
     * @param {string} filename a filename, best be basename
     */
    make(filename) {
        if (typeof filename !== 'string') {
            throw Error('Expected the filename to be a string.');
        }
        const basename = path.basename(filename);
        const children = this.children || [];
        const absPath = path.join(this.absPath, basename);
        const stats = fs.statSync(absPath);
        children.push(createFsNode(filename, stats, this));
        this.children = children;
    }

    /**
    * 重命名
    * @param {String} newName
    */
    rename(oldName, newName) {
        if (typeof oldName !== 'string' || typeof newName !== 'string') {
            throw Error('Expected both the old filename and the new filename to be string type.');
        }

        /**
         * 找到 oldName对应的节点
         */
        const parent = this;
        const { children, absPath } = parent;
        const child = children.find(item => item.name === oldName);

        if (!child) {
            throw Error(`not found child named ${oldName}.`);
        }

        /**
         * 移除旧节点
         */
        parent.remove(oldName);

        /**
         * 如果重命名的是个文件夹，从这个文件夹开始重新创建一边map
         * 如果是个文件，就创建一个新的
         */
        const newPath = path.resolve(absPath, newName);
        if (child.isDirectory()) {
            createFsMap(newPath, parent);
        } else {
            parent.make(newName);
        }
    }

    /**
     * 删除文件
     */
    remove(filename) {
        let found = false;
        this.children = this.children.map((child) => {
            const result = child.name !== filename;
            if (!result) {
                found = true;
            }
            return result;
        });
        return found;
    }

    /**
     * 读取文件夹
     * @param {object} options options for fs.readdirSync
     */
    readdirSync(options) {
        try {
            return fs.readdirSync(this.absPath, options || {
                encoding: 'utf-8',
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * 传入一个文件名
     * @param {filename} filename
     * @param {function} callback
     */
    clearDiff(filename, callback) {
        const basename = path.basename(filename);
        const dirNode = this;
        const absPath = path.resolve(dirNode.absPath, basename);
        const lastChildren = dirNode.children;
        const curChildren = dirNode.readdirSync();
        const curLen = curChildren.length;
        const lastLen = lastChildren.length;

        if (curLen > lastLen) {
            // 多了文件
            if (curChildren.includes(basename)) {
                // 新建文件
                dirNode.make(basename);
                callback('create', absPath);
            }
        } else if (curLen < lastLen) {
            // 少了文件
            if (lastChildren.includes(basename)) {
                // 删除文件
                dirNode.remove(basename);
                callback('remove', absPath);
            }
        } else {
            // 重命名
            dirNode.rename(basename);
            callback('remove', absPath);
        }
    }

    /**
     * diff
     * @param {function} callback
     */
    diff(callback) {
        const fsNode = this;
        const lastChildren = fsNode.children;
        const curChildren = fsNode.readdirSync();

        const lastLen = lastChildren.length;
        let i = 0;
        do {
            const curLen = curChildren.length;
            if (!curLen) {
                break;
            }
            let j = 0;
            do {
                const { name, ino } = lastChildren[i];
                const filename = curChildren[j];
                let stats = null;
                try {
                    stats = fs.statSync(path.resolve(fsNode.absPath, filename));
                    if (
                        name === filename
                        && ino === stats.ino
                    ) {
                        curChildren.splice(j, 1);
                        lastChildren.splice(i, 1);
                    }
                } catch (err) {
                    //
                }
                j += 1;
            } while (j < curLen);
            i += 1;
        } while (i < lastLen);
    }

    find(absPath) {
        const fsMap = this;
        // TODO: fsMap 类型校验
        if (!absPath) {
            throw new Error('Argument path is required.');
        }

        if (typeof absPath !== 'string') {
            throw new TypeError('Expected the path to be a string.');
        }

        if (!path.isAbsolute(absPath)) {
            throw TypeError(`path '${absPath}' must be absolute`);
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
        const normalizedPath = path.normalize(sortPath).replace(splitReg, '');
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

            result.unshift(fsNode);

            /**
             * 如果文件节点不存在，就终止本次查找
             */
            if (!fsNode) {
                // not found
                found = false;
                break;
            }

            fsNodes = fsNode.children;
        }

        return {
            result,
            type: found ? 'found' : 'notFound',
        };
    }

    traverse(visitor) {
        if (visitor && !isObject(visitor)) {
            throw new TypeError('Expected the visitor to be a object.');
        }
        /**
         * 用来中止traveser的函数
         */
        const state = {
            shouldBreak: false,
            break: () => {
                this.shouldBreak = true;
            },
        };

        const fsMap = this;

        recursionTraverse(fsMap.children, visitor, state);
    }
};

function recursionTraverse(fsArr, visitor, state) {
    const len = fsArr.length;
    if (!len) {
        return;
    }

    let file = null;
    let i = 0;

    for (; i < len; i += 1) {
        file = fsArr[i];
        if (visitor[file.name]) {
            /**
             * 执行visitor
             */
            visitor[file.name](file, state.break);
            /**
             * 如果用户在visitor中调用了break, 则停止整个traverse
             */
            if (state.shouldBreak) {
                return;
            }
        }

        if (file.children) {
            recursionTraverse(file.children, visitor, state);
            if (state.shouldBreak) {
                return;
            }
        }
    }
}
