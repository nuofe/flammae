// ~~~~~~~~~~~~~~~~~~
// /!\ 注意 /!\
// ~~~~~~~~~~~~~~~~~~
//
// 不要改这个文件中的代码
//
// 个性化配置可在项目根目录创建一个 cli.config.js文件进行配置
//
// ~~~~~~~~~~~~~~~~~~
// /!\ 注意 /!\
// ~~~~~~~~~~~~~~~~~~

'use strict';

const fs = require('fs-extra')
const resolveApp = require('./paths').resolveApp

// 开发者自定义的配置
const userConfig = (
    fs.existsSync(resolveApp('flammae.config.js')) ?
    require(resolveApp('flammae.config.js')) :
    null
);

// 默认配置
const defaultConfig = {
    server: {
        port: 8090,
        host: '127.0.0.1'
    },
    alias: {
        '@': resolveApp('src')
    },
    extensions: [],
    // 暂时只支持 sass | less， 其他需要可向作者反馈
    // 在这里改了后，记得下载对应的 loader 
    style: {
        lang: null,
        loader: null,
        rule: null
    }
};


module.exports = merge(defaultConfig, userConfig)


// 拷贝
function merge(target, obj) {
    if (!obj) return target
    target = Object.assign({}, target)
    let targetItem;
    let objItem;
    for (let key in obj) {
        targetItem = target[key];
        objItem = obj[key];

        if (typeof objItem !== 'object' || objItem === null) {
            target[key] = objItem;
            continue;
        }
        if (Object.prototype.toString.call(objItem) === '[object Array]') {
            target[key] = [...new Set(targetItem.concat(objItem))]
            continue;
        }

        target[key] = Object.assign({}, targetItem, objItem);

    }

    return target
}