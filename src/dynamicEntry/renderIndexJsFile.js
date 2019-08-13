'use strict';

const fs = require('fs');
const render = require('@flammae/tpl-engine');
const { sepToModuleSystem } = require('@flammae/helpers');
const { appIndexFileTpl } = require('../paths');

module.exports = function getRenderIndexJsFile(output) {
    // 读取模板 index.js, 项目入口文件
    const indexTplText = fs.readFileSync(appIndexFileTpl, {
        encoding: 'utf8',
    });
    return function renderIndexJsFile({ src }) {
        src('/.theme/styles/*.{css,scss,less,sass,styl}').then(nodes => {
            const stylePaths = nodes.map(node =>
                sepToModuleSystem(node.absPath)
            );
            // 生成index.js文本
            const text = render(indexTplText, { stylePaths });
            fs.writeFileSync(output, text);
        });
    };
};
