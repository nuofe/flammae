/**
 * Author: L.S
 * 2019-02-28
 * 
 * 在webpack启动前，解析项目目录，找到 .md文件，解析文件头部的frontmatter
 * 根据frontmatter中配置的path来生成路由
 * 
 */
process.on('uncaughtException', err => {
    throw err
})
process.on('unhandledRejection', err => {
    throw err
})
process.on('exit', (code) => {
    console.log(`退出码: ${code}`)
})

const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const markdownParse = require('./libs/markdown/parse')
const jsxParse = require('./libs/jsx-parse')
const {
    appSrc,
    flameSrc
} = require('../config/paths')

// 这里文档路径 以后可配置. 暂时没空做
// 目前默认 appRoot/src/docs
const docDir = path.resolve(appSrc, 'docs')
const pageDir = path.resolve(appSrc, 'pages')


if (!fs.existsSync(appSrc)) {
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    console.log(chalk.red('请在项目根目录下创建 src 文件夹！\n'))
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    process.exit(1)
    return
}

if (
    !fs.existsSync(path.resolve(appSrc, 'docs')) &&
    !fs.existsSync(path.resolve(appSrc, 'pages'))
) {
    console.log()
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    console.log(`flame 依赖${chalk.yellow('src/docs')}文件夹下的markdown文件（以 ${chalk.yellow('.md')}做后缀的文件），\n`)
    console.log(`或${chalk.yellow('src/pages')}文件夹下的jsx文件（以 ${chalk.yellow('.jsx')}做后缀的文件）以生成页面，\n`)
    console.log(`请确保至少有一个上述文件夹存在，且文件夹内部存在有效文件。\n`)
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    process.exit(1)
    return
}

// 读取flame 项目下的目录
// src/docs 目录被规定为专门存放 .md文件
// src/pages 目录下被规定专门存放 .jsx文件
// 将会根据每个文档的头部 信息 生成对应的 页面
function parseFiles() {
    const pageNames = fs.existsSync(pageDir) ? fs.readdirSync(pageDir) : []
    const docNames = fs.existsSync(docDir) ? fs.readdirSync(docDir) : []
    const fileNames = docNames.concat(pageNames)

    if (fileNames.length) {
        Promise.all(
            fileNames.map(fileName => {
                const isJSX = fileName.match(/.*\.jsx$/)
                if (!isJSX && !fileName.match(/.*\.md$/)) return

                return new Promise(resolve => {
                    const filePath = path.resolve(isJSX ? pageDir : docDir, fileName)
                    fs.readFile(filePath, {
                        encoding: 'utf8'
                    }, (err, data) => {
                        if (err) {
                            console.log(err)
                            resolve()
                        } else {
                            resolve({
                                data,
                                path: filePath
                            })
                        }
                    })
                })
            }).filter(Boolean)
        ).then(files => {

            const docDatas = []
            const pageDatas = []

            files.forEach(file => {
                const isJSX = file.path.match(/.*\.jsx$/)
                if (isJSX) {
                    const pageData = jsxParse(file.data, file.path)
                    pageData && pageDatas.push(pageData)
                } else {
                    const doc = markdownParse(file.data, file.path)
                    doc && docDatas.push(doc.frontmatter)
                }
            })

            writeData({
                docs: docDatas,
                pages: pageDatas
            })
        }).catch(err => {
            console.log(err)
            writeData()
        })
    } else {
        writeData()
    }
}

parseFiles()

// 将静态数据写入文件中
// 启动文件观察
// 启动webpack
let webpackStarted = false
function writeData(data) {
    data = data || {
        docs: null,
        pages: null
    }
    fs.writeFileSync(path.resolve(flameSrc, 'static-data.json'), JSON.stringify(data))

    if (webpackStarted) return
    webpackStarted = true
    watchDocDir()
    const mode = process.argv[2].slice(1)
    require(`./${mode}.js`)()
}


// 监听文件 创建修改
function watchDocDir() {
    // const watcher = fs.watch(docDir, {

    // })
}