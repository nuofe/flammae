const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const {
    routesFileTpl,
    appTempRoute,
} = require('../../paths');

module.exports = function renderRoutes(
    siteData = { docs: [], pages: [] },
) {
    try {
        // 读取 模板 routes.jsx 文件
        const routesTplText = fs.readFileSync(routesFileTpl, { encoding: 'utf8' });
        // 生成文本
        const routesText = render(routesTplText, {
            siteData,
        });
        // 写入 .flammae/routes.jsx
        fs.writeFileSync(appTempRoute, routesText);
    } catch (err) {
        throw new Error(err);
    }
};
