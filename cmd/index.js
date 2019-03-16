#!/usr/bin/env node

process.on('unhandledRejection', err => {
    throw err;
});

process.on('uncaughtException', err => {
    throw err;
});



const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const packageJSON = require('../package.json');

console.log();

if (!process.argv.slice(2).length) {
    printCliHelp();
}

let projectName; // 项目名称
let projectRoot; // 项目根目录
const ownPath = path.dirname(
    require.resolve(path.join(__dirname, '..', 'package.json'))
); // cli根目录

const useYarn = !spawn.sync('yarn', ['-v']).error;



const templatePackageJSON = require(path.resolve(ownPath, 'template/package.json')); // 模板package.json


program.version(packageJSON.version)
    .command('create [project-directory]')
    .description('创建一个flammae项目')
    .action(name => {
        if (!name) {
            console.log(chalk.yellow('给你的项目起个名字，例如：'), chalk.cyan('flammae create 我的项目名 \n'));
            process.exit(1);
        }
        projectName = name;
        projectRoot = path.resolve(process.cwd(), name);
    });

program.on('command:*', printCliHelp);

program.parse(process.argv);

function printCliHelp(command) {
    command && console.log(`无效的指令：${command}\n`);
    console.log(`使用 ${chalk.cyan('flammae create 项目名')} 指令创建一个flammae项目。\n`);
    console.log(`输入 ${chalk.cyan('flammae -h')} 查看更多\n`);
    process.exit(1);
}

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
        }).catch(err=> {
            console.log(chalk.red('文件夹清理失败，请手动清理。'))
            throw err
        })
    } else {
        fs.ensureDirSync(projectRoot);
        run();
    }

})();



// 将默认文件写入项目文件夹 并 执行个性化配置
function run(options) {
    console.log();

    console.log(`正在 ${chalk.cyan(projectRoot)} 文件夹下创建项目... \n`);

    // 拷贝文件夹
    try {
        fs.copySync(
            path.resolve(ownPath, 'template/base'),
            projectRoot
        );

        fs.copySync(
            path.resolve(ownPath, `template/${useYarn ? 'yarn_lock' : 'package_lock'}`),
            path.resolve(projectRoot, useYarn ? 'yarn.lock' : 'package-lock.json')
        );

        fs.copySync(
            path.resolve(ownPath, `template/gitignore`),
            path.resolve(projectRoot, '.gitignore')
        );

    } catch (err) {
        throw err;
    }


    // 固定模板
    const packageJSON = {
        name: projectName,
        version: '0.1.0',
        main: 'index.js',
        author: '',
        description: '',
        private: true,
        license: 'MIT',
        scripts: {
            start: 'node scripts/dev',
            build: 'node scripts/build'
        },
        babel: {
            presets: [
                'react-app'
            ]
        },
        eslintConfig: {
            extends: "@78d6/eslint-config-react-app"
        },
        styleExtension: options.styleExtension
    };

    // 写入 package.json 文件
    writeJsonSync(
        path.join(projectRoot, 'package.json'),
        packageJSON
    );


    // dependencies
    const packages = options.packages.concat(Object.keys(templatePackageJSON.dependencies));
    // devDependencies
    const devPackages = Object.keys(templatePackageJSON.devDependencies).concat(
        options.styleExtension === 'less' ? ['less', 'less-loader'] : ['node-sass', 'fast-sass-loader']
    );

    install(packages.concat(devPackages))
        .then(() => {
            console.log();
            console.log(`安装完成。 \n`);
            console.log(`执行 ${chalk.cyan(`cd ${projectName}`)} 进入项目目录 \n`);
            console.log(`然后执行 ${chalk.cyan(`${useYarn ? 'yarn':'npm'} start`)} 开始开发 \n`);
        }).catch(err => {
            console.log(`${chalk.cyan(err)} 执行出错。`)
        });

}

function install(packages) {
    return new Promise((resolve, reject) => {
        console.log('正在安装模块，请稍等... \n');

        const cmd = useYarn ? 'yarn' : 'npm';
        const cmdArgs = useYarn ? ['add', '--exact'] : ['install', '--save'];

        // 安装。为了省事，全都 按照dependencies 安装
        const child = spawn(cmd, [...cmdArgs, ...packages], {
            cwd: projectRoot,
            stdio: 'inherit'
        });

        child.on('close', code => {
            if (code !== 0) {
                reject(`${cmd} ${cmdArgs.join(' ')}`);
                return;
            }
            resolve();
        });
    });
}

// 同步写入json文件
function writeJsonSync(path, data, onSuccess, onError) {
    try {
        fs.writeJsonSync(
            path,
            data, {
                spaces: 4
            }
        );
        onSuccess && onSuccess();
    } catch (err) {
        onError && onError();
        throw err;
    }
}