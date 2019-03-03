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
const fs = require('fs-extra')
const jsxParse = require('./libs/jsx-parse')
const markdownParse = require('./libs/markdown/parse')
const {
    appSrc,
    flameSrc
} = require('../config/paths')

function appSrcJoin(src) {
    return path.join(appSrc, src)
}

function flameSrcJoin(src) {
    return path.join(flameSrc, src)
}

// 将路径转换成js可以加载的路径
// D:\flame\root\src =>  D:/flame/root/src
function resolvePath(p) {
    return p.split(path.sep).join('/')
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第一步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 确保flameRoot/src/temp目录存在且为空
// 确保appRoot/src 目录存在
fs.emptyDirSync(flameSrcJoin('temp'))
fs.ensureDirSync(appSrc)


const docDir = appSrcJoin('docs')
const pageDir = appSrcJoin('pages')





// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第二步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 读取appRoot/src文件夹下的内容
// appRoot/src/docs 目录被规定专门存放 .md文件
// appRoot/src/pages 目录被规定专门存放 .jsx文件
// 将会根据每个文档的头部 信息 生成对应的 页面
// .md文件通过在头部编写frontmatter来为 flame提供信息
// ---
// path: '/one'
// ---
//
// .jsx文件通过在头部编写行级注释来为 flame提供信息
//
// path: '/one'
//
function parseFiles(fileNames) {
    if (!fileNames) return
    if (fileNames.length) {
        Promise.all(
            fileNames.map(fileName => {
                const isJSX = fileName.match(/.*\.jsx$/)
                if (!isJSX && !fileName.match(/.*\.md$/)) return

                return new Promise(resolve => {
                    const filePath = path.join(isJSX ? pageDir : docDir, fileName)
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
                    pageData && pageDatas.push(Object.assign({}, pageData, {
                        filePath: file.path,
                        type: 'page'
                    }))
                } else {
                    const doc = markdownParse(file.data, file.path)
                    doc && docDatas.push(Object.assign({}, doc.frontmatter, {
                        filePath: file.path,
                        type: 'doc'
                    }))
                }
            })

            writeData({
                docs: docDatas,
                pages: pageDatas
            })
            startWepack()
        }).catch(err => {
            console.log(err)
            writeData()
            startWepack()
        })
    } else {
        writeData()
        startWepack()
    }
}

;
(function () {
    const pageNames = fs.existsSync(pageDir) ? fs.readdirSync(pageDir) : []
    const docNames = fs.existsSync(docDir) ? fs.readdirSync(docDir) : []

    parseFiles(docNames.concat(pageNames))
})();




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第三步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// 将静态数据写入临时文件中
//
function writeData(data) {
    data = data || {
        pages: [],
        docs: []
    }
    try {
        let appStr = fs.readFileSync(flameSrcJoin('app.template.jsx'), {
            encoding: 'utf8'
        })
        const tempAppPath = flameSrcJoin('temp/app.jsx')
        const tempStaticPath = flameSrcJoin('temp/site-data.json')

        const templateIndexPath = appSrcJoin('templates/index.jsx')
        const templateContentPath = appSrcJoin('templates/content.jsx')

        appStr = insertImport(
            'Index',
            (
                fs.existsSync(templateIndexPath) ?
                resolvePath(templateIndexPath) :
                '../templates/index'
            ),
            appStr
        )

        if (data.docs.length) {
            appStr = insertImport(
                'Content',
                (
                    fs.existsSync(templateContentPath) ?
                    resolvePath(templateContentPath) :
                    '../templates/content'
                ),
                appStr
            )
        }

        // 根据文件目录生成app.jsx文件，并配置内部路由
        data.pages.concat(data.docs).forEach((item, i) => {
            const isDoc = item.type === 'doc'
            const name = isDoc ? `Md${i}` : `Comp${i}`
            const render = (
                !isDoc ?
                `component={${name}}` :
                `render={()=><Content data={${name}}/>}`
            );
            appStr = insertImport(name, resolvePath(item.filePath), appStr)
            appStr = insertRoute(render, item.path, appStr)
        })

        // 向 site-data.json文件中存入静态数据
        fs.writeFileSync(tempStaticPath, JSON.stringify(data))
        // 生成 app.jsx
        fs.writeFileSync(tempAppPath, appStr)
    } catch (err) {
        throw err
    }
}

function insertImport(name, path, target) {
    return target.replace('/* import */', `import ${name} from '${path}';\n/* import */`)
}

function insertRoute(render, path, target) {
    return target.replace('{/* route */}', `<Route path='${path}' ${render} />\n{/* route */}`)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第四步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 启动webpack
// 启动文件监听
function startWepack() {
    if (this.webpackStarted) return
    this.webpackStarted = true

    // 监听文件添加修改
    watchDocDir()

    const mode = process.argv[2].slice(1)
    require(`./${mode}.js`)()
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第五步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 监听文件 创建修改
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 待优化，监听特定文件，因此没必要改一个之后其他都分析，只要分析改的哪个

function watchDocDir() {
    fs.watch(appSrc, {
        encoding: 'utf8',
        recursive: true
    }, (event, shorPath) => {

        const filePath = appSrcJoin(shorPath)
        console.log(123)
        const pageNames = fs.existsSync(pageDir) ? fs.readdirSync(pageDir) : []
        const docNames = fs.existsSync(docDir) ? fs.readdirSync(docDir) : []
        parseFiles(docNames.concat(pageNames))
    })
}