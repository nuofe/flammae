'use strict';

const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const { markdownRenderTpl } = require('../paths');

module.exports = function returnRenderMdRenderer(output) {
    return function renderMdRendererJsFile({ src }) {
        // src;
        const tplText = fs.readFileSync(markdownRenderTpl, {
            encoding: 'utf8',
        });
        // 生成文本
        const renderText = render(tplText, {
            // content,
            // demo,
            // markdown,
        });
        // 写入 .flammae/markdown-render.jsx
        fs.writeFileSync(output, renderText);
    };
};
