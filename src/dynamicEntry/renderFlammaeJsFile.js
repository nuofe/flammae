'use strict';

const fs = require('fs-extra');

/**
 * 生成**flammae.js**文件，在项目中可以通过 `import{ siteData } from 'flammae';` 来获取所有数据
 */
module.exports = function returnRenderFlammae(output) {
    return function renderFlammae(done) {
        const code = `
export { default as siteData } from './site-data.json';
export { default as routes } from './route-data';`;
        fs.writeFileSync(output, code);
        done();
    };
};
