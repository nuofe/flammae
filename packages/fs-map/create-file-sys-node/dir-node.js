const fs = require('fs');
const path = require('path');
const FsNode = require('./fs-node');
const createFsMap = require('../index');
const createFsNode = require('./index');
const isObject = require('../utils/is-object');


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
        const absPath = path.join(this.absPath, basename);
        const stats = fs.statSync(absPath);
        const fsNode = createFsNode(filename, stats, this, this.hook);
        let found = false;
        /**
         * 如果已存在，就覆盖
         */
        this.children = (this.children || []).map((child) => {
            if (child.name === basename) {
                found = true;
                return fsNode;
            }
            return child;
        });
        /**
         * 不存在
         */
        if (!found) {
            this.children.push(fsNode);
        }
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
        if (child.isDirectory) {
            const newPath = path.resolve(absPath, newName);
            createFsMap(newPath, this.hook, parent);
        } else {
            parent.make(newName);
        }
    }

    /**
     * 删除文件
     */
    remove(filename) {
        let result = false;
        this.children = this.children.filter((child) => {
            const found = child.name === filename;
            if (found) {
                result = true;
            }
            return !found;
        });
        return result;
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
     * TODO：不是很准确，更精准的diff
     * 传入一个文件名
     * @param {filename} filename
     * @param {function} callback
     */
    clearDiff(filename, callback) {
        const basename = path.basename(filename);
        const dirNode = this;
        const absPath = path.resolve(dirNode.absPath, basename);
        const lastChildren = dirNode.children.map(item => item.name);
        const curChildren = dirNode.readdirSync();
        const curLen = curChildren.length;
        const lastLen = lastChildren.length;
        // console.log();
        // console.log(`diff ${filename} in ${this.absPath}`);
        // console.table({
        //     curLen,
        //     lastLen,
        //     includesCur: curChildren.includes(basename),
        //     cur: curChildren.join('-'),
        //     includesLast: lastChildren.includes(basename),
        //     Last: lastChildren.join('-'),
        // });

        if (curLen > lastLen) {
            /**
             * 新建：create
             * 多了文件，且新文件列表中包含传入的文件名
             */
            if (curChildren.includes(basename)) {
                dirNode.make(basename);
                callback('create', dirNode, absPath);
            }
        } else if (curLen < lastLen) {
            /**
             * 删除：remove
             * 少了文件，且旧文件列表中包含传入的文件名
             */
            if (lastChildren.includes(basename)) {
                dirNode.remove(basename);
                callback('remove', dirNode, absPath);
            }
        } else if (
            lastChildren.includes(basename)
            && !curChildren.includes(basename)
        ) {
            /**
             * 两个文件列表一样长，新文件列表中存在的，
             * 旧文件列表中不存在
             */
            // TODO:
            const [[oldName], [newName]] = diff(curChildren, lastChildren);
            dirNode.rename(newName, oldName);
            callback('rename', dirNode, path.resolve(dirNode.absPath, newName), path.resolve(dirNode.absPath, oldName));
        } else {
            callback('unknown', dirNode, absPath);
        }
    }


    /**
     * 根据传入的路径找到map中对应的
     * @param {string} absPath
     */
    find(absPath) {
        const fsMap = this;

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
         * 将路径转成从盘符开始的绝对路径
         * path.resolve can also do normalize
         */
        const ensureAbsPath = path.resolve(absPath);

        /**
         * 确保查询的路径存在于当前的 fsMap 中
         */
        if (ensureAbsPath.indexOf(fsMap.absPath) === -1) {
            throw Error(
                `the absolute path (${ensureAbsPath}) you traversed, \n`
                + `       have nothing to do with the fsMap.absPath (${fsMap.absPath}) you gave.\n`,
            );
        }


        /**
         * 路径分隔符可以有以下几种形式
         * - c:\\a\\b
         * - a\b\c
         * - a/b/c
         */
        const splitReg = /\\\\|\\|\//;
        const sortPath = ensureAbsPath.replace(fsMap.absPath, '');

        /**
         * 去掉开头的 / or \ or \\
         * /a/b/c => a/b/c
         */
        const normalizedPath = path.normalize(sortPath).replace(splitReg, '');

        /**
         * 'a/b/c' => ['a','b','c']
         */
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
        let found = true;
        const result = [fsMap];
        let fsNodes = fsMap.children;
        let i = 0;
        const { length } = filenameArr;
        for (; i < length; i += 1) {
            /**
             * 找到文件名对应的文件节点
             */
            const filename = filenameArr[i];
            const fsNode = fsNodes.find(fsNodeItem => fsNodeItem.name === filename);

            if (fsNode) {
                result.unshift(fsNode);
            }

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
            index: length - i,
        };
    }

    /**
     *
     * @param {object} visitor
     */
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

// /**
//  * TODO
//  * diff
//  * @param {function} callback
//  */
// diff(callback) {
//     const fsNode = this;
//     const lastChildren = fsNode.children;
//     const curChildren = fsNode.readdirSync();
//     const lastLen = lastChildren.length;
//     let i = 0;
//     do {
//         const curLen = curChildren.length;
//         if (!curLen) {
//             break;
//         }
//         let j = 0;
//         do {
//             const { name, ino } = lastChildren[i];
//             const filename = curChildren[j];
//             let stats = null;
//             try {
//                 stats = fs.statSync(path.resolve(fsNode.absPath, filename));
//                 if (
//                     name === filename
//                     && ino === stats.ino
//                 ) {
//                     curChildren.splice(j, 1);
//                     lastChildren.splice(i, 1);
//                 }
//             } catch (err) {
//                 //
//             }
//             j += 1;
//         } while (j < curLen);
//         i += 1;
//     } while (i < lastLen);
// }

/**
 * 找出两个数组中的不同项
 * @param {array} targetOne
 * @param {array} targetTwo
 */
function diff(targetOne, targetTwo) {
    if (!Array.isArray(targetOne) || !Array.isArray(targetTwo)) {
        throw Error('Expected anyone of the arguments to be an Array.');
    }
    const isFirstLong = targetOne.length > targetTwo.length;
    let i = 0;
    const len = isFirstLong ? targetTwo.length : targetOne.length;
    const copyLong = isFirstLong ? [...targetOne] : [...targetTwo];
    const copyShort = isFirstLong ? targetTwo : targetOne;
    const diffArr = [];
    for (; i < len; i += 1) {
        const item = copyShort[i];
        const index = copyLong.indexOf(item);
        if (index > -1) {
            copyLong.splice(index, 1);
        } else {
            diffArr.push(item);
        }
    }
    return isFirstLong ? [copyLong, diffArr] : [diffArr, copyLong];
}
