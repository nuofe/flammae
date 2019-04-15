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


const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const flammaePackagePath = '../packages/flammae-utils'
const jsxParse = require(path.join(flammaePackagePath,'jsx-parse'))
const markdownParse = require(path.join(flammaePackagePath,'markdown/parse'))

const {
    appSrc,
    appCacheTemp,
    resolveApp,
    resolveAppCache,
    resolveFlammae,
} = require('../config/paths')



// 将路径转换成js可以加载的路径
// D:\flammae\root\src =>  D:/flammae/root/src
function resolvePath(p) {
    return p.split(path.sep).join('/')
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第一步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 确保flammaeRoot/src/temp目录存在且为空
// 确保appRoot/src 目录存在
console.log('\n初始化...\n')
fs.emptyDirSync(appCacheTemp)
fs.ensureDirSync(appSrc)


const docDir = resolveApp('src/docs')
const pageDir = resolveApp('src/pages')

const siteData = {
    pages: [],
    docs: []
}

const docsMap = {}
const pagesMap = {}





// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第二步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 读取appRoot/src文件夹下的内容
// appRoot/src/docs 目录被规定专门存放 .md文件
// appRoot/src/pages 目录被规定专门存放 .jsx文件
// 将会根据每个文档的头部 信息 生成对应的 页面
// .md文件通过在头部编写frontmatter来为 flammae提供信息
// ---
// path: '/one'
// ---
//
// .jsx文件通过在头部编写行级注释来为 flammae提供信息
//
// path: '/one'
//
function parseFiles(filePaths) {
    if (!filePaths || (Array.isArray(filePaths) && filePaths.length === 0)) {
        startWepack()
        return
    }
    if (typeof filePaths === 'string') {
        filePaths = [filePaths]
    }
    Promise.all(
        filePaths.map(filePath => {
            return new Promise(resolve => {
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
        console.log('开始提取文件信息...\n')
        files.forEach((file, i) => {

            const isJSX = file.path.match(/.*\.jsx$/)
            if (isJSX) {
                const pageData = jsxParse(file.data, file.path)
                pageData && siteData.pages.push(Object.assign({}, pageData, {
                    filePath: file.path,
                    __type: 'page'
                }))
            } else {
                const mdData = markdownParse(file.data, file.path)
                mdData && siteData.docs.push(Object.assign({}, mdData.frontmatter, {
                    filePath: file.path,
                    __type: 'doc'
                }))

            }
        })

        startWepack()
    }).catch(err => {
        console.log(err)
        startWepack()
    })
}

console.log('正在读取文件...\n')
parseFiles(getFilePaths(docDir, pattern).concat(getFilePaths(pageDir, pattern)));

function pattern(filePath) {
    return filePath.match(/.*\.(jsx|md)$/)
}

function patternJSX(filePath) {
    const isJSX = filePath.match(/.*\.jsx$/)
    return isJSX
}

function patternMD(filePath) {
    const isMD = filePath.match(/.*\.md$/)
    return isMD
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                  第三步
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 
// 将静态数据写入临时文件中
// 写入路由
// 写入网站的静态数据
//
function writeFlammeIndex() {
    const code = `export {default as siteData} from './temp/site-data.json';`
    fs.writeFileSync(resolveAppCache('flammae.js'), code)
}
function writeStylesToIndexJs() {
    const stylePaths = getFilePaths(resolveApp('src/styles'))
    const indexJsPath = resolveFlammae('src/templates/index.js')
    let indexJsStr = fs.readFileSync(indexJsPath, {
        encoding: 'utf8'
    })
    stylePaths.forEach(stylePath => {
        indexJsStr = insertImport(indexJsStr, resolvePath(stylePath))
    })
    fs.writeFileSync(resolveAppCache('temp/index.js'), indexJsStr)
}

function writeFile() {
    console.log('正在写入数据...\n')
    try {
        let appStr = fs.readFileSync(resolveFlammae('src/templates/app.jsx'), {
            encoding: 'utf8'
        })
        const tempAppPath = resolveAppCache('temp/app.jsx')
        const tempStaticPath = resolveAppCache('temp/site-data.json')

        const templateIndexPath = resolveApp('src/templates/index')
        const templateContentPath = resolveApp('src/templates/content')

        appStr = insertImport(
            appStr,
            (
                existsSyncFileOrDir(templateIndexPath) ?
                resolvePath(templateIndexPath) :
                resolvePath(resolveFlammae('src/templates/home/index.jsx'))
            ),
            'Index'
        )

        if (siteData.docs.length) {
            appStr = insertImport(
                appStr,
                (
                    existsSyncFileOrDir(templateContentPath) ?
                    resolvePath(templateContentPath) :
                    resolvePath(resolveFlammae('src/templates/content/index.jsx'))
                ),
                'Content'
            )
            appStr = insertImport(
                appStr,
                resolvePath(resolveFlammae('src/templates/markdown')),
                'Markdown'
            )
        }
        // 根据文件目录生成app.jsx文件，并配置内部路由
        siteData.pages.concat(siteData.docs).forEach((item, i) => {
            const isDoc = item.__type === 'doc'
            const name = isDoc ? `Md${i}` : `Comp${i}`
            const render = (
                !isDoc ?
                `component={${name}}` :
                `render={()=><Content renderMarkdown={()=><Markdown md={${name}}/>} data={${name}}/>}`
            );
            appStr = insertImport(appStr, resolvePath(item.filePath), name)
            appStr = insertRoute(render, item.path, appStr)
        })

        // 向 site-data.json文件中存入静态数据
        fs.writeFileSync(tempStaticPath, JSON.stringify(siteData))
        // 生成 app.jsx
        fs.writeFileSync(tempAppPath, appStr)
    } catch (err) {
        throw err
    }
}

function insertImport(target, path, name) {
    if (name) {
        return target.replace('/* import */', `import ${name} from '${path}';\n/* import */`)
    }
    return target.replace('/* import */', `import '${path}';\n/* import */`)
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
    writeFlammeIndex();
    writeStylesToIndexJs()
    writeFile()

    if (this.webpackStarted) return
    this.webpackStarted = true

    console.log('启动webpack...\n')
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

// 这里可能导致bug， writeFile会重新触发 watchDocDir。目前用 debounce 解决
function watchDocDir() {
    fs.watch(appSrc, {
        encoding: 'utf8',
        recursive: true
    }, debounce((event, shorPath) => {
        console.log(`\n${chalk.yellow(event)} > ${shorPath} \n`)
        const dir = shorPath.split(path.sep)[0]
        if (dir === 'templates') {
            writeFile()
        } else if (dir === 'styles') {
            writeStylesToIndexJs()
        } else if (['docs', 'pages'].includes(dir)) {
            siteData[dir] = []
            // 这里可以做diff优化            
            parseFiles(getFilePaths(resolveApp(`src/${dir}`), pattern))
        }
    }))
}






// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                      utils
//  __    __  .___________. __   __           _______.
// |  |  |  | |           ||  | |  |         /       |
// |  |  |  | `---|  |----`|  | |  |        |   (----`
// |  |  |  |     |  |     |  | |  |         \   \    
// |  `--'  |     |  |     |  | |  `----..----)   |   
//  \______/      |__|     |__| |_______||_______/   
//                      utils
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * 读取目标文件夹内所有指定类型文件路径，并返回由文件路径组成的数组
 * 没读取到返回空数组
 * 
 * @param {string} dir 目标文件夹
 * @param {function} callback 接受文件路径作为参数。可对路径进行解析，并返回Boolean类型值
 *                            如果callback返回 true，该路径将最终被 getFilePaths返回，否则不返回
 * 
 */
function getFilePaths(dir, callback) {
    callback = callback || (() => true);
    let filesPaths = []
    const direntArr = fs.existsSync(dir) ? fs.readdirSync(dir, {
        withFileTypes: true
    }) : []
    direntArr.length && direntArr.forEach(dirent => {
        if (dirent.isFile()) {
            const absolutePath = path.resolve(dir, dirent.name)
            if (!callback(absolutePath)) {
                return
            }
            filesPaths.push(absolutePath)
        } else if (dirent.isDirectory()) {
            filesPaths = filesPaths.concat(getFilePaths(path.resolve(dir, dirent.name), callback))
        }
    })
    return filesPaths
}


/**
 * 防抖
 * @param {function} fn 
 * @param {number} time 
 */
function debounce(fn, time) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, time || 300)
    }
}

/**
 * 判断当前路径是否存在，无论是文件夹还是指定的文件
 * @param {string} targetPath 目标路径
 * @param {array} suffixs 文件后缀名
 */
function existsSyncFileOrDir(targetPath, suffixs = ['.jsx', '.js']) {
    if (fs.existsSync(targetPath)) {
        return true
    }
    return suffixs.some(suffix => {
        try {
            const file = fs.statSync(targetPath + suffix)
            return file && file.isFile()
        } catch (err) {
            return false
        }
    })

}