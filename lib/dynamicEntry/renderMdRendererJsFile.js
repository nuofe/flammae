'use strict';

const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const { glob } = require('@flammae/fs-helpers');
const { markdownRenderTpl } = require('../paths');

module.exports = function returnRenderMdRenderer(output) {
    return function renderMdRendererJsFile(done) {
        // src;
        const tplText = fs.readFileSync(markdownRenderTpl, {
            encoding: 'utf8',
        });

        glob({
            '.theme/override/content/index.jsx'() {},
            '.theme/override/demo/index.jsx'() {},
        });

        // 生成文本
        const renderText = render(tplText, {
            content,
            demo,
            markdown,
        });
        // 写入 .flammae/markdown-render.jsx
        fs.writeFileSync(output, renderText);
    };
};

function renderFile(tplPath, output, sourceData) {
    // src;
    const tplText = fs.readFileSync(tplPath, {
        encoding: 'utf8',
    });
    // 生成文本
    const renderText = render(tplText, sourceData);
    fs.writeFileSync(output, renderText);
}
