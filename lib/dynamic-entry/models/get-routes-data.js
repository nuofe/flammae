'use strict';

/**
 * 以promise的形式读取文件
 */
function readFilePromise(node, type) {
    return new Promise((resolve, reject) => {
        node.readFile(
            {
                encoding: 'utf8',
            },
            (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    data,
                    type,
                    sortPath: node.sortPath,
                    filePath: node.absPath,
                });
            }
        );
    });
}

/**
 * 读取所有用于生成路由的文件信息
 * \\.theme\\pages\\**\\*.jsx
 * \\docs\\**\\*.md
 */
function getRoutesData(fsMap) {
    const promises = [];

    fsMap.traverse({
        /**
         * 匹配项目目录docs目录下所有的.md文档
         */
        '/docs/**/*.md': node => {
            if (node.isDirectory) {
                return;
            }
            promises.push(readFilePromise(node, 'doc'));
        },

        /**
         * 匹配.theme/pages目录下，所有在文件夹中的index.jsx
         *
         * 匹配：
         * /.theme/pages/home/index.jsx
         * /.theme/pages/a/b/index.jsx
         *
         * 不匹配：
         * /.theme/pages/index.jsx
         * /.theme/pages/home/a.jsx
         *
         */
        '/.theme/pages/*/**/index.jsx': node => {
            if (node.isDirectory) {
                return;
            }
            promises.push(readFilePromise(node, 'page'));
        },
        /**
         * TODO: 将反glob 作为 traverse的配置项传入
         */
        '!{/docs,/docs/**,/docs/**/*.md,/.theme,/.theme/pages,/.theme/pages/**,/.theme/pages/**/index.jsx}': (
            node,
            opts
        ) => {
            opts.continue();
        },
    });

    if (!promises.length) {
        return Promise.resolve([]);
    }

    return Promise.all(promises);
}

module.exports = getRoutesData;
