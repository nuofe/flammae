'use strict';

/* eslint-disable no-underscore-dangle */
const execWebpack = require('@flammae/webpack-execter');
const dynamicEntry = require('./dynamic-entry');
const webpackConfigFactory = require('./webpack-config');

/**
 * 启动flammae
 * @param {'production'|'development'} mode webpack模式
 */
function startFlammae(mode) {
    const __DEV__ = mode === 'development';
    // 生成webpack配置
    const webpackConfig = webpackConfigFactory({
        mode,
        entry: dynamicEntry(),
    });
    // 运行webpack
    const exector = __DEV__ ? execWebpack.runServer : execWebpack.runBuild;
    exector(webpackConfig);
}

module.exports = startFlammae;
