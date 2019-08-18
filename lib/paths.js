'use strict';

const path = require('path');

const ownRoot = path.resolve(__dirname, '../');
const resolveOwn = src => path.resolve(ownRoot, src);

// const appRoot = fs.realpathSync(cwd);
// const resolveApp = src => path.resolve(appRoot, src);
// const resolveAppCache = src => path.resolve(appRoot, '.flammae', src);
// const resolveAppTheme = src => path.resolve(appRoot, '.theme', src);

module.exports = {
    // TODO: 找一个好的地方来存放缓存信息
    // 文件夹
    // appRoot,
    // appDocs: resolveApp('docs'),
    // appTheme: resolveAppTheme('.'),
    // appCache: resolveAppCache('.'),
    // appDefaultDist: resolveApp('flammaeDist'),
    // 运行时临时文件
    // flammae: resolveAppCache('flammae.js'),
    // appEntryTempFile: resolveAppCache('index.js'),
    // appDataTempFile: resolveAppCache('site-data.json'),
    // appRouteDataTempFile: resolveAppCache('route-data.js'),
    // mdRenderTempFile: resolveAppCache('markdown-render.jsx'),
    // // 用户自定义的文件及目录
    // globalStylesDir: resolveAppTheme('styles'),
    // demoCompOverrideFile: resolveAppTheme('override/demo'),
    // contentCompOverrideFile: resolveAppTheme('override/content'),
    // appCompOverrideFile: resolveAppTheme('override/app'),

    nodeModule: resolveOwn('node_modules'),

    templates: resolveOwn('./templates'),

    // 模板组件及页面
    appHomePageTplFile: resolveOwn('templates/components/home'),
    deomTplComponent: resolveOwn('templates/components/demo'),
    contentTplComponent: resolveOwn('templates/components/content'),
    markdownTplComponent: resolveOwn('templates/components/markdown'),

    //  .tpl 渲染模板
    appRouterCompTplFile: resolveOwn('templates/tpls/router.jsx'),
    appIndexFileTpl: resolveOwn('templates/tpls/index.tpl'),
    routeDataFileTpl: resolveOwn('templates/tpls/route-data.tpl'),
    markdownRenderTpl: resolveOwn('templates/tpls/markdown-render.tpl'),

    // html
    appTemplateHtml: resolveOwn('templates/public/index.html'),
};
