const fs = require('fs-extra');
const { appDataTempFile } = require('../../paths');

/**
 * 在项目 **.flammae** 文件夹下写入**site-data.json**文件，
 * 该文件包含所有该项目的全局数据
 */
module.exports = function renderSiteDataJson(
    siteData = { docs: [], pages: [] }
) {
    // 向 site-data.json文件中存入静态数据
    fs.writeFileSync(appDataTempFile, JSON.stringify(siteData));
};
