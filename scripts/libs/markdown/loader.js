const parse = require('./parse')

const loaderMap = {
    jsx: require('./jsx-loader')
}

// 空格  针对不同平台判断，不同换行符。
const {
    space,
    newLine
} = require('../new-line')
//
// codeBlock 是下面格式的markdown文本
//
// ::: only （不加 only 就显示demo和代码, 加了就只显示demo）
// 代码的一些说明写在这里
// ``` jsx
//  code here
// ```
// :::
//
const codeBlockSym = ':::'
const codeSym = '\`\`\`'

function genReg(sym) {
    return `${sym}(${space}*)(.*)?(${newLine})((?:(?!(${sym})).)*(${newLine}))*${sym}`
}

const codeBlockReg = genReg(codeBlockSym)
const codeReg = genReg(codeSym)

let mdStr;


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
    const codeBlocks = mdStr.match(new RegExp(codeBlockReg, 'gm'))

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


/**
 * 分析需要演示的代码
 * @param {array} codeBlocks 
 * @param {*} options 
 * 
 */
// codeBlocks 是由下面格式的markdown文本组成的数组
// ::: only （不加 only 就显示demo和代码, 加了就只显示demo）
// 代码的一些说明写在这里
// \`\`\` jsx
//  code here
// \`\`\`
// :::
// 
const optObj = {
    getStr: ()=>{return mdStr},
    setStr: (newStr)=>{mdStr = newStr}
}
function codeParse(codeBlocks, options) {
    const str = codeBlocks.map(codeBlock=>{
                // 分离出
                // \`\`\` jsx
                // code here
                // \`\`\`
                const codeWrapStr = codeBlock.match(codeReg)[0]
                // 分离出
                // ::: only
                // info text
                // :::
                const blockWrapStr = codeBlock.replace(codeWrapStr, '')
                //    语言   代码                
                const [lang, code] = split(codeWrapStr, codeSym)
                //   演示指令     演示代码的附加信息
                const [demoInfo, codeNote] = split(blockWrapStr, codeBlockSym)

                const fn = loaderMap[lang.trim()]
                return fn && fn(
                    {
                        code,
                        codeNote,
                        demoInfo,
                        codeWrapStr,
                        codeBlock
                    },
                    options,
                    optObj
                )

            }).filter(Boolean).join(',')

    return `[${str}]`
}

function split(str, sym) {
    const arr = str.replace(new RegExp(sym,'g'),'').match(new RegExp(`(.*)(${newLine})((.|${newLine})*)`))
    return [arr[1].trim(),arr[3]]
}