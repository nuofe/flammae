/* eslint-disable */
const dynamicEntry = require('@flammae/dynamic-entry');
// const execWebpack = require('webpack-execter');
const webpackConfigFactory = require('./webpack.config');

function startFlammae() {
    dynamicEntry();
    return;
    const webpackConfig = webpackConfigFactory('development', {
        entry: dynamicEntry(),
    });
    execWebpack.runServer(webpackConfig);
}

module.exports = {
    start: startFlammae,
};
