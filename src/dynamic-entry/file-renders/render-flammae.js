const fs = require('fs-extra');
const { flammae } = require('../../paths');

/**
 * 在项目的 **.flammae** 文件夹下生成**flammae.js**文件，
 * 这样在项目中可以通过 `import{ siteData } from 'flammae';` 来获取所有数据
 */
module.exports = function renderFlammae() {
    const code = `
export {default as routes} from './route-data';
export {default as siteData} from './site-data.json';
`;
    fs.writeFileSync(flammae, code);
};