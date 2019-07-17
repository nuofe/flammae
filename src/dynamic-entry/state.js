const createFsMap = require('@flammae/fs-map');
const {
    appRoot,
} = require('../paths');

// 从根目录开始创建一个fsMap
const fsMap = createFsMap(appRoot);


module.exports = fsMap;

fsMap.watch({

    /**
     * TODO: 不准确
     * 路由
     */
    '{/docs,/docs/**,/docs/**/*.md,/.theme/pages,/.theme/pages/**,/.theme/pages/*/**/index.jsx}': () => {
        getRoutesDataAndWriteInFiles();
    },

    /**
     * 主题样式
     */
    '/.theme/styles,.theme/styles/*.{less,css,scss,sass}': () => {
        getGlobalStylesDataAndWriteFiles();
    },

    '/.theme': () => {
        getGlobalStylesDataAndWriteFiles();
        getRoutesDataAndWriteInFiles();
    },

    /**
     * 主题模板
     */
    '/.theme/templates/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {
        renderMarkdownRenderer(getModulesPathMap());
    },
});
