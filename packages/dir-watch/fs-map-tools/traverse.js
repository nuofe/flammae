const isObject = require('./utils/is-object');

/**
 *
 */
module.exports = function traverse(fsMap, visitor) {
    // TODO: fsMap 类型校验
    if (!fsMap) {
        return;
    }

    if (visitor && !isObject(visitor)) {
        throw TypeError('visitor must be a plain object');
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

    recursionTraverse(fsMap.children, visitor, state);
};

function recursionTraverse(fsArr, visitor, state) {
    let file = null;
    let i = 0;
    const len = fsArr.length;

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
