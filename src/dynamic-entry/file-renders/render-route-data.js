const fs = require('fs-extra');
const render = require('@flammae/tpl-engine');
const { routeDataFileTpl, appRouteDataTempFile } = require('../../paths');

module.exports = function renderRoutes(siteData = { docs: [], pages: [] }) {
    try {
        // 读取 模板 routes.jsx 文件
        const routeDataTplText = fs.readFileSync(routeDataFileTpl, {
            encoding: 'utf8',
        });
        // 生成文本
        const routeDataText = render(routeDataTplText, { siteData });

        // 写入 .flammae/routes.jsx
        fs.writeFileSync(appRouteDataTempFile, routeDataText);
    } catch (err) {
        throw new Error(err);
    }
};
