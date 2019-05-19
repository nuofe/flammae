/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-01 13:10:11
 * @LastEditTime: 2019-05-17 15:42:31
 */
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config')('production');
const {
    appBuild,
} = require('../../shared/paths');

module.exports = function startTheBuildProgram() {
    // 在程序执行的最开始配置环境变量
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';

    console.log();
    if (fs.existsSync(appBuild)) {
        console.log(chalk.cyan('正在清理旧的打包文件... \n'));
        fs.removeSync(appBuild);
        console.log(chalk.cyan('开始重新打包... \n'));
    } else {
        console.log(chalk.cyan('开始打包... \n'));
    }

    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
        if (err) {
            throw err;
        }
        const messages = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });

        if (!messages.errors.length && !messages.warnings.length) {
            console.log(chalk.green(`打包完成：${appBuild}`));
            process.exit(0);
            console.log();
        } else {
            console.log(chalk.red('编译出错！\n'));
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
};
