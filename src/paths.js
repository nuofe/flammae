'use strict';

const fs = require('fs');
const path = require('path');

/**
 * 1. 全局安装
 * flammae有自己的node_modules
 *
 * 2. 局部安装时
 * flammae没有自己的node_modules
 * flammae跟项目共用一个node_modules
 *
 *
 *
 */

const appRoot = fs.realpathSync(process.cwd());
const ownRoot = path.resolve(__dirname, '../');

const resolveOwn = src => path.resolve(ownRoot, src);
const resolveApp = src => path.resolve(appRoot, src);
const resolveAppCache = src => path.resolve(appRoot, '.flammae', src);
const resolveAppTheme = src => path.resolve(appRoot, '.theme', src);

const templates = resolveOwn('./templates');

module.exports = {
    // TODO: 找一个好的地方来存放缓存信息

    // 文件夹
    appRoot,
    appDocs: resolveApp('docs'),
    appTheme: resolveAppTheme('.'),
    appCache: resolveAppCache('.'),
    appDefaultDist: resolveApp('flammaeDist'),
    templates,
    nodeModules: [
        'node_modules',
        resolveApp('node_modules'),
        resolveOwn('node_modules'),
    ],
    // 运行时临时文件
    flammae: resolveAppCache('flammae.js'),
    appEntryTempFile: resolveAppCache('index.js'),
    appDataTempFile: resolveAppCache('site-data.json'),
    appRouteDataTempFile: resolveAppCache('route-data.js'),
    mdRenderTempFile: resolveAppCache('markdown-render.jsx'),

    // 用户自定义的文件及目录
    globalStylesDir: resolveAppTheme('styles'),
    demoCompOverrideFile: resolveAppTheme('override/demo'),
    contentCompOverrideFile: resolveAppTheme('override/content'),
    appCompOverrideFile: resolveAppTheme('override/app'),

    // 模板组件及页面
    appAppCompTemplateFile: resolveOwn('templates/components/app.jsx'),
    appHomePageTemplateFile: resolveOwn('templates/components/home'),
    deomTplComponent: resolveOwn('templates/components/demo'),
    contentTplComponent: resolveOwn('templates/components/content'),
    markdownTplComponent: resolveOwn('templates/components/markdown'),

    //  .tpl 渲染模板
    appIndexFileTpl: resolveOwn('templates/tpls/index.tpl'),
    routeDataFileTpl: resolveOwn('templates/tpls/route-data.tpl'),
    markdownRenderTpl: resolveOwn('templates/tpls/markdown-render.tpl'),

    // html
    appTemplateHtml: resolveOwn('templates/public/index.html'),
};
