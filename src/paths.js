const fs = require('fs');
const path = require('path');

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
    templates,
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('node_modules'),

    // 运行时临时文件
    flammae: resolveAppCache('flammae.js'),
    appTempIndex: resolveAppCache('index.js'),
    appTempRoute: resolveAppCache('routes.jsx'),
    appTempMarkdownRender: resolveAppCache('markdown-render.jsx'),
    appTempDataFile: resolveAppCache('site-data.json'),

    // 自定义的页面及组件
    globalStylesDir: resolveAppTheme('styles'),
    customAppRouteIndex: resolveAppTheme('pages/index.jsx'),
    customContentComponent: resolveAppTheme('templates/content'),
    customDemoComponent: resolveAppTheme('templates/demo'),

    // 模板组件及页面
    routeIndexTplPage: resolveOwn('templates/.theme/pages/home'),
    contentTplComponent: resolveOwn('templates/.theme/templates/content'),
    markdownTplComponent: resolveOwn('templates/.theme/templates/markdown'),
    deomTplComponent: resolveOwn('templates/.theme/templates/demo'),

    // 模板
    routesFileTpl: resolveOwn('templates/tpls/routes.tpl'),
    appIndexFileTpl: resolveOwn('templates/tpls/index.tpl'),
    markdownRenderTpl: resolveOwn('templates/tpls/markdown-render.tpl'),

    // 静态资源
    appTemplateHtml: resolveOwn('templates/public/index.html'),
};
