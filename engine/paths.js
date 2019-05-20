
const {
    resolveAppCache,
    resolveApp,
    resolveFlammae,
} = require('../shared/paths');

module.exports = {

    // 模板文件路径
    templateAppTpl: resolveFlammae('templates/temp/app.tpl'),
    templateIndexTpl: resolveFlammae('templates/temp/index.tpl'),
    templateHomeJsx: resolveFlammae('templates/home/index.jsx'),
    templateContentJsx: resolveFlammae('templates/content/index.jsx'),

    // 项目内文件夹
    appDocsDir: resolveApp('docs'),
    appPagesDir: resolveApp('pages'),
    appStylesDir: resolveApp('.theme/styles'),
    appHomeFile: resolveApp('.theme/templates/home'),
    appContentFile: resolveApp('.theme/templates/content'),

    // 临时文件夹
    tempFlammaeModuleFile: resolveAppCache('flammae.js'),
    tempAppJsx: resolveAppCache('temp/app.jsx'),
    tempIndexJs: resolveAppCache('temp/index.js'),

    // markdown 组件
    markdown: resolveFlammae('templates/components/markdown/index.jsx'),

};
