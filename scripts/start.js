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


const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const {
    appSrc,
    packageSrc
} = require('../config/paths')

if (!fs.existsSync(appSrc)) {
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    console.log(chalk.red('请在项目根目录下创建 src 文件夹！\n'))
    console.log(chalk.red('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'))
    process.exit(1)
    return
}
if(
    !fs.existsSync(path.resolve(appSrc, 'docs')) 
    && !fs.existsSync(path.resolve(appSrc, 'pages'))
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


const startWebpack = (function () {
    let started = false
    return function (data) {
        if (started) return
        started = true

        const staticData = JSON.stringify({
            docs: data,
            // pages:
        })

        fs.writeFileSync(path.resolve(packageSrc, 'static-data.json'), staticData)

        watchDocDir()
        const mode = process.argv[2].slice(1)
        require(`./${mode}.js`)()
    }
})();



// 这里文档路径 以后可配置. 暂时没空做
// 目前默认 appRoot/src/docs
const docDir = path.resolve(appSrc, 'docs')
const docPaths = fs.existsSync(docDir) ? fs.readdirSync(docDir) : []

const pageDir = path.resolve(appSrc,'pages')
const pagePaths = fs.existsSync(pageDir) ? fs.readdirSync(pageDir) :[]

if (docPaths.length) {
    Promise.all(
        docPaths.map(docPath =>
            docPath.match(/.*\.md$/) && (
                new Promise(resolve => {
                    const filePath = path.resolve(docDir, docPath)
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
            )
        )

    ).then(files => {
        // 分析 .md 文件中的数据
        const docData = parseFile(files.filter(Boolean))
        startWebpack(docData)
    }).catch(err => {
        console.log(err)
        startWebpack()
    })
} else {
    startWebpack()
}




const newLineSym = '\r\n'

// 提取 frontmatter
function parseFile(files) {
    return files.map(file => {
        const newLineSym = '\r\n'
        let frontmatter = null
        const fmReg = `---${newLineSym}((${newLineSym}|.)*)${newLineSym}---`
        const fmMatcher = file.data.match(new RegExp(fmReg))
        if (fmMatcher) {
            frontmatter = frontmatterParse(fmMatcher[1])
        }
        if (!frontmatter) {
            console.warn(`未能从${file.path}文件中找到frontmatter，该文档将不被显示`)
            return
        } else if (!frontmatter.path) {
            console.warn(`未能从${file.path}文件中找到路径（path）信息，该文档将不被显示`)
            return
        }
        return frontmatter
    }).filter(Boolean)
}

function frontmatterParse(str) {
    const arr = str.replace(/('|")/gm, '').split(newLineSym).filter(Boolean)
    const obj = {}
    arr.forEach(item => {
        const subArr = item.split(':')
        obj[subArr[0].trim()] = subArr[1].trim()
    })
    return obj
}


// 监听文件 创建修改
function watchDocDir() {
    // const watcher = fs.watch(docDir, {

    // })
}