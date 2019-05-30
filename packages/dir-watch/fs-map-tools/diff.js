const path = require('path');
const traverse = require('./traverse');
const normalizeFilename = require('./utils/normalize-filename');

module.exports = function diff(filename, fsMap) {
    const normalizedPath = normalizeFilename(filename);
    // '/a/b/c' => 'c'
    const paths = normalizedPath.split(/\\\\|\\|\//);

    if (!path.length) {
        return;
    }

    const visitorName = paths.length === 1 ? paths[0] : paths.slice(-2, -1);

    if (!paths) {
        traverse(normalizeFilename, fsMap, {
            [visitorName]: (fsNode) => {
                const lastChildren = fsNode.children ? Object.keys(fsNode.children) : [];
                const curChildren = fsNode.readdirSync();

                const curLen = curChildren.length;
                const lastLen = lastChildren.length;

                if (curLen > lastLen) {
                    // 多了文件
                    if (curChildren.includes(basename)) {
                        // 新建文件
                        fsNode.make(basename);
                    }
                } else if (curLen < lastLen) {
                    // 少了文件
                    if (lastChildren.includes(basename)) {
                        // 删除文件
                        fsNode.children[basename].remove();
                    }
                } else {
                    // 重命名
                    fsNode.children[basename].rename();
                }
            },
        });
    }
};
