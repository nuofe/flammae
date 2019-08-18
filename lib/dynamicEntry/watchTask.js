'use strict';

const fsWatch = require('@flammae/fs-enhance/lib/fsWatch');

module.exports = function watch() {
    fsWatch({
        /**
         * TODO: 不准确
         * 路由
         */
        '{/docs,/docs/**,/docs/**/*.md,/.theme/pages,/.theme/pages/**,/.theme/pages/*/**/index.jsx}': () => {},

        /**
         * 主题样式
         */
        '/.theme/styles,.theme/styles/*.{less,css,scss,sass}': () => {},

        '/.theme': () => {},

        /**
         * 主题模板
         */
        '/.theme/override/{content.jsx,demo.jsx,content/index.js,demo.jsx}': () => {},
        './.theme/override/{app.jsx,app/index.jsx}': () => {},
    });
};
