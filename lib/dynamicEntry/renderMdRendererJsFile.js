'use strict';

const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const { pathExistSync, sepToModuleSystem } = require('@flammae/helpers');
const {
    markdownRenderTpl,
    contentTplComponent,
    deomTplComponent,
    markdownTplComponent,
} = require('../paths');
const {
    overrideDemoFile,
    overrideContentFile,
    markdownRenderJsxFile,
} = require('../fileSchema');

module.exports = function returnRenderMdRenderer(resolveApp) {
    const overrideContentPath = resolveApp(overrideContentFile);
    const overrideDemoPath = resolveApp(overrideDemoFile);
    const output = resolveApp(markdownRenderJsxFile);

    return function renderMdRendererJsFile(done) {
        // content 组件路径
        const content = pathExistSync(overrideContentPath)
            ? sepToModuleSystem(overrideContentPath)
            : sepToModuleSystem(contentTplComponent);

        const demo = pathExistSync(overrideDemoPath)
            ? sepToModuleSystem(overrideDemoPath)
            : sepToModuleSystem(deomTplComponent);

        // markdown 组件
        const markdown = sepToModuleSystem(markdownTplComponent);

        const tplText = fs.readFileSync(markdownRenderTpl, {
            encoding: 'utf8',
        });

        // 生成文本
        const renderText = render(tplText, {
            content,
            demo,
            markdown,
        });
        // 写入 .flammae/markdown-render.jsx
        fs.writeFileSync(output, renderText);

        done();
    };
};
