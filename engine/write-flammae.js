const fs = require('fs-extra');
const {
    tempFlammaeModuleFile,
} = require('./paths');
/**
 * 在项目的**node_modules/.cache/flammae**文件夹下生成**flammae.js**文件，
 * 这样在项目中可以通过 `import{ siteData } from 'flammae';` 来获取所有数据
 */
module.exports = function writeFlammeModuleFileSync() {
    const code = 'export {default as siteData} from \'./temp/site-data.json\';';
    fs.writeFileSync(tempFlammaeModuleFile, code);
};
