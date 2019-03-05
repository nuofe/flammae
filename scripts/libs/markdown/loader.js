const parse = require('./parse')
const babel = require("@babel/core")
// const fs = require('fs-extra')

// 空格  针对不同平台判断，不同换行符。
const {
    space,
    newLine
} = require('../new-line')
// code
const codeReg = `\`\`\`(${space})*(.[^${newLine}]*)?${newLine}((?:(?!(\`\`\`)).)*${newLine})*\`\`\``


let mdStr;

function editStr(newStr) {
    mdStr = newStr
}

module.exports = function (fileStr) {
    // 解析frontmatter 和 headings
    const {
        frontmatter,
        headings,
        text
    } = parse(fileStr);

    mdStr = text;
    
    let demos = null;
    // 提取代码块，并解析成一个组件
    const codeBlocks = mdStr.match(new RegExp(codeReg, 'gm'))
    if (codeBlocks) {
        // flame在启动前会检测所有md文件的 frontmatter， 如果没有frontmatter， 则文件不会被加载
        // 所以这里frontmatter 是一定会存在的， 不用 做额外判断
        demos = codeParse(codeBlocks, frontmatter)
    }

    // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
    return `export default {
        ${
            JSON.stringify({
                frontmatter: frontmatter,
                headings:headings,
                text: mdStr
            }).replace(/\`/gm, '\\\`').slice(1,-1)
        },
        demos: ${demos ? demos : '[]'}
    }`
}



const jsxLoader = (function () {
    let id = 0
    return function (codeStr, rawCodeStr, options, mdStr, callback) {
        const modules = options.modules
        if (!modules || !Array.isArray(modules)) {
            console.log('你使用了demo功能，请确保frontmatter中存在modules属性，且为数组格式')
            console.log('即使在Demo中没使用modules，也需要将modules设置为[]')
            return null
        }
        const key = `demo-wrapper-${id++}`
        callback(mdStr.replace(rawCodeStr, `<div id='${key}' ><\/div>\n\n`))
        // 解析 jsx
        const result = babel.transformSync(codeStr, {
            presets: ["@babel/preset-env", "@babel/preset-react"]
        })
        return `{
            elId: '${key}',
            fn: function(${modules.join(',')}) { ${result.code};return Demo},
            code: \`${rawCodeStr.replace(/\`/gm, '\\\`')}\`
        }`
    }
})();




function codeParse(codeBlocks, options) {
    return `[
        ${
            codeBlocks.map(rawCodeStr=>{

                // \`\`\` jsx demo something
                // code here
                // \`\`\`
                // 去除代码字符串两头的 \`\`\` 符号
                const strBlock = rawCodeStr.replace(/\`\`\`/mg, '')
        
                // 分离 代码前缀信息 和 代码  jsx demo something
                let [prefixInfo, ...codeLines] = strBlock.split(newLine)
                const codeStr = codeLines.join(newLine)
                prefixInfo = prefixInfo.trim()
                // 分析语言
                const lang = prefixInfo.match(/\S*/)[0]
                // 分析 demo 标识符
                const demoInfo = prefixInfo.split(/\s+/)[1]
                if (demoInfo && demoInfo === 'demo') {
        
                    if(lang === 'jsx') {

                        return jsxLoader(codeStr, rawCodeStr, options, mdStr, editStr)
                    }
                }
            }).filter(Boolean).join(',')
        }
    ]`
}