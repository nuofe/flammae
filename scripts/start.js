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

const fs = require('fs')
const path = require('path')
const mdLoader = require('../config/markdown-loader')
const {
    appSrc
} = require('../config/paths')

if (!fs.existsSync(appSrc)) {
    process.exit(1)
}


// 这里文档路径 以后可配置. 暂时没空做
// 目前默认 appRoot/src/docs
const docDir = path.resolve(appSrc, 'docs')

const docPaths = fs.existsSync(docDir) && fs.readdirSync(docDir)

if (docPaths) {
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
        ).filter(Boolean)
    ).then(files => {
        // 分析 .md 文件中的数据
        const docData = parseFile(files)
        // 将数据存到环境变量中
        process.env.staticData = JSON.stringify({
            docs: docData
        })
        startWebpack()
    }).catch(err => {
        console.log(err)
        startWebpack()
    })
} else {
    startWebpack()
}

let started = false
function startWebpack() {
    if(started) return
    started = true
    watchDocDir()
    const mode = process.argv[2].slice(1)
    require(`./${mode}.js`)()
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
        } else if(!frontmatter.path) {
            console.warn(`未能从${file.path}文件中找到路径（path）信息，该文档将不被显示`)
            return
        }
        return frontmatter
    }).filter(Boolean)

}
function frontmatterParse(str) {
    const arr = str.replace(/('|")/gm, '').split(newLineSym).filter(Boolean)
    const obj = {}
    arr.forEach(item=>{
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