'use strict';

const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const { markdownRenderTpl, mdRenderTempFile } = require('../../paths');

module.exports = function renderMarkdowRenderer(modulesPathMap) {
    try {
        const markdownRenderTplText = fs.readFileSync(markdownRenderTpl, {
            encoding: 'utf8',
        });
        // 生成文本
        const renderText = render(markdownRenderTplText, modulesPathMap);
        // 写入 .flammae/markdown-render.jsx
        fs.writeFileSync(mdRenderTempFile, renderText);
    } catch (err) {
        throw new Error(err);
    }
};
