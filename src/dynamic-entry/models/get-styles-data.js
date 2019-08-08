'use strict';

const { sepToModuleSystem } = require('@flammae/helpers');

/**
 * 读取 .theme\\styles\\*.{css,less,scss} 文件的路径
 */
module.exports = function getStylesData(fsMap) {
    const stylePaths = [];
    fsMap.traverse({
        '/.theme/styles/*.{css,scss,less,sass,styl}': node => {
            if (node.isDirectory) {
                return;
            }
            stylePaths.push(sepToModuleSystem(node.absPath));
        },
        '!{/.theme,/.theme/styles,/.theme/styles/*.{css,scss,less,sass,styl}}': (
            node,
            opts
        ) => {
            opts.continue();
        },
    });

    return stylePaths;
};
