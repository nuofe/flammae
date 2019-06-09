#!/usr/bin/env node

/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-04-16 10:33:28
 * @LastEditTime: 2019-04-18 09:55:51
 */

process.on('uncaughtException', (err) => {
    throw err;
});

process.on('unhandledRejection', (err) => {
    throw err;
});

process.on('exit', (code) => {
    console.log(`exit code: ${code}`);
});

const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const packageJSON = require('../package.json');
const createProject = require('./create-project');

if (!process.argv.slice(2).length) {
    printCliHelp();
}

const ownPath = path.dirname(
    require.resolve(path.join(__dirname, '..', 'package.json')),
); // cli根目录

// flammae create prooject-name
program
    .version(packageJSON.version)
    .command('create [project-directory]')
    .description('创建一个flammae项目')
    .action((projectName) => {
        console.log();
        if (!projectName) {
            console.log(chalk.yellow('给你的项目起个名字，例如：'), chalk.cyan('flammae create 我的项目名 \n'));
            process.exit(1);
        }
        createProject(ownPath, projectName, path.resolve(process.cwd(), projectName));
    });

// flammae run ...
// 启动引擎
program
    .command('run <cmd>')
    .action((cmd) => {
        let child = null;
        if (['dev', 'build'].includes(cmd)) {
            const engineEntry = path.resolve(ownPath, 'engine/index.js');
            child = spawn('node', [engineEntry, `-${cmd}`], {
                cwd: path.resolve(process.cwd()),
                stdio: 'inherit',
            });
        } else {
            child = spawn('npm', ['run', cmd], {
                cwd: path.resolve(process.cwd()),
                stdio: 'inherit',
            });
        }

        child.on('close', (code) => {
            if (code !== 0) {
                console.log(`run ${cmd} failed`);
            }
        });
    });


program.on('command:*', printCliHelp);

program.parse(process.argv);

function printCliHelp(command) {
    command && console.log(`无效的指令：${command}\n`);
    console.log(`使用 ${chalk.cyan('flammae create 项目名')} 指令创建一个flammae项目。\n`);
    console.log(`使用 ${chalk.cyan('flammae run <cmd>')} 执行指令。\n`);
    console.log(`输入 ${chalk.cyan('flammae -h')} 查看更多\n`);
    process.exit(1);
}
