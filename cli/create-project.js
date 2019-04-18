/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description: 
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:34:06
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const inquirer = require('inquirer');
const path = require('path');

const useYarn = !spawn.sync('yarn', ['-v']).error;


module.exports = function (ownPath, projectName, projectRoot, ) {
    // 判断文件夹是否已被占用
    //  -- 占用。退出程序
    //  -- 没占用。创建文件夹
    (function existDir() {

        process.once('exit', code => {
            if (code === -1) return;
            fs.remove(projectRoot, err => {
                if (err) throw err;
            });
        });

        if (fs.existsSync(projectRoot)) {
            inquirer.prompt({
                type: 'confirm',
                message: `项目名称 ${projectName} 已被占用，是否覆盖？（将删除文件夹内所有内容）`,
                default: false,
                name: 'overwrite'
            }).then(res => {
                console.log();
                if (!res.overwrite) {
                    process.exit(-1);
                }
                console.log('正在清理文件夹... \n');
                fs.emptyDirSync(projectRoot);
                console.log('清理完成。\n');
                run();
            }).catch(err => {
                console.log(chalk.red('文件夹清理失败，请手动清理。'))
                throw err
            })
        } else {
            fs.ensureDirSync(projectRoot);
            run();
        }

    })();



    // 将默认文件写入项目文件夹 并 执行个性化配置
    function run() {
        console.log();

        console.log(`正在 ${chalk.cyan(projectRoot)} 文件夹下创建项目... \n`);

        // 拷贝文件夹
        try {
            fs.copySync(
                path.resolve(ownPath, 'cli/templates'),
                projectRoot
            );
        } catch (err) {
            throw err;
        }

        console.log(`创建完成。 \n`);
        console.log(`执行 ${chalk.cyan(`cd ${projectName}`)} 进入项目目录 \n`);
        console.log(`然后执行 ${chalk.cyan(`flammae run dev`)} 开始开发 \n`);
        // install()
        //     .then(() => {
        //         console.log();
        //         console.log(`安装完成。 \n`);
        //         console.log(`执行 ${chalk.cyan(`cd ${projectName}`)} 进入项目目录 \n`);
        //         console.log(`然后执行 ${chalk.cyan(`${useYarn ? 'yarn':'npm'} start`)} 开始开发 \n`);
        //     }).catch(err => {
        //         console.log(`${chalk.cyan(err)} 执行出错。`)
        //     });

    }

    // function install() {
    //     return new Promise((resolve, reject) => {
    //         console.log('正在安装模块，请稍等... \n');

    //         const cmd = useYarn ? 'yarn' : 'npm';

    //         // 安装。为了省事，全都 按照dependencies 安装
    //         const child = spawn(cmd, ['install'], {
    //             cwd: projectRoot,
    //             stdio: 'inherit'
    //         });

    //         child.on('close', code => {
    //             if (code !== 0) {
    //                 reject(`${cmd} install`);
    //                 return;
    //             }
    //             resolve();
    //         });
    //     });
    // }
}