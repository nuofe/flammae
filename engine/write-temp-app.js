const fs = require('fs-extra');
const {
    tempAppJsx,
    appHomeFile,
    appContentFile,
    markdown,
    templateAppTpl,
    templateHomeJsx,
    templateContentJsx,
} = require('./paths');
const {
    resolvePath,
    pathExistSync,
} = require('../shared/utils');
const viewGen = require('../packages/tpl-engine');


module.exports = function writeTempAppFileSync(siteData) {
    try {
        const modulesPathMap = {
            Index: pathExistSync(appHomeFile)
                ? resolvePath(appHomeFile)
                : resolvePath(templateHomeJsx),
            Content: pathExistSync(appContentFile)
                ? resolvePath(appContentFile)
                : resolvePath(templateContentJsx),
            Markdown: markdown,
        };
        // 读取 模板 app.jsx 文件
        const appTplText = fs.readFileSync(templateAppTpl, { encoding: 'utf8' });
        // 生成文本
        const appText = viewGen(appTplText, {
            siteData,
            modulesPathMap,
            resolvePath,
        });
        // 写入 appRoot/node_modules/.cache/flammae/temp/app.jsx
        fs.writeFileSync(tempAppJsx, appText);
    } catch (err) {
        console.error(err);
        process.exit(0);
    }
};
