const fs = require('fs-extra');
const {
    resolveAppCache,
} = require('../shared/paths');

/**
 * 在项目**node_modules/.cache/flammae/temp**文件夹下写入**site-data.json**文件，
 * 该文件包含所有该项目的全局数据
 */
module.exports = function writeTempSiteDataFileSync(siteData) {
    const tempStaticPath = resolveAppCache('temp/site-data.json');
    // 向 site-data.json文件中存入静态数据
    fs.writeFileSync(tempStaticPath, JSON.stringify(siteData));
};
