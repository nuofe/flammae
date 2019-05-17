/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-01 13:10:11
 * @LastEditTime: 2019-04-16 10:18:52
 */

module.exports = function () {
    // 在程序执行的最开始配置环境变量
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';

    const chalk = require('chalk');
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    // webpack 开发环境配置
    const webpackConfig = require('../config/webpack.config')('development');
    // webpack-dev-server配置
    const serverConfig = require('../config/webpackDevServer.config');

    const config = require('../config/config');

    // 返回一个webpack的compiler实例
    function createCompiler(webpack, webpackConfig) {
        const compiler = webpack(webpackConfig);


        // 注意 "invalid" 是 "bundle invalidated" 的缩写，并不意味着任何错误。
        // invalid 事件会在你修改文件（改代码）时会触发，此时，webpack会重新打包。
        // webpackDevServer会暂停服务器 一直等待webpack打包完成，
        // 如果此时你刷新浏览器，将不会有响应，直到打包完成。
        compiler.hooks.invalid.tap('invalid', () => {
            console.log('正在编译...');
        });


        let isFirstCompile = true;
        // "done"事件会在webpack编译并重新打包完成后触发。
        // 即使中间出现执行错误或警告
        compiler.hooks.done.tap('done', (stats) => {
            const messages = stats.toJson({
                all: false,
                warnings: true,
                errors: true,
            });

            const compileSuccessful = !messages.errors.length && !messages.warnings.length;

            if (compileSuccessful) {
                console.log(chalk.green('编译成功！'));
            }
            // 首次编译成功后（npm start）时执行
            if (compileSuccessful && isFirstCompile) {
                isFirstCompile = false;
                console.log(
                    `服务器启动成功：${chalk.green(`http://${config.server.host}:${config.server.port}`)}`,
                );
            }

            if (!compileSuccessful) {
                console.log();
                if (messages.errors.length) {
                    console.log(chalk.red('错误信息：\n'));
                    messages.errors.forEach(error => console.log(`${error}\n`));
                }
                if (messages.warnings.length) {
                    console.log(chalk.yellow('警告信息：\n'));
                    messages.warnings.forEach(warning => console.log(`${warning}\n`));
                }
            }
        });
        return compiler;
    }


    WebpackDevServer.addDevServerEntrypoints(webpackConfig, serverConfig);

    const compiler = createCompiler(webpack, webpackConfig);

    const devServer = new WebpackDevServer(compiler, serverConfig);

    // 开启 devServer
    devServer.listen(config.server.port, config.server.host, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log(chalk.cyan('-------------------------\n'));
        console.log(chalk.cyan('| 正在启动开发服务器>>> |\n'));
        console.log(chalk.cyan('-------------------------\n'));
    });
};
