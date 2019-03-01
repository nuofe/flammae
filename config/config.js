
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

const fs = require('fs-extra');
const {
    resolveApp,
    copy
} = require('./devtool/utils');

const styleExtension = require(resolveApp('package.json')).styleExtension;

// 开发者自定义的配置
const userConfig = fs.existsSync(resolveApp('flame.config.js')) 
    ? require(resolveApp('flame.config.js'))
    : null

// 默认配置
const defaultConfig = {
    server: {
        port: 8080,
        host: '127.0.0.1'
    },
    alias: {
        '@app': resolveApp('src')
    },
    extensions: [],
    // 暂时只支持 sass | less， 其他需要可向作者反馈
    // 在这里改了后，记得下载对应的 loader 
    style: styleExtension || 'sass'
};


module.exports = copy(defaultConfig, userConfig);