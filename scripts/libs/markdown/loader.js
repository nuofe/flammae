const parse = require('./parse')
const loaderMap = {
    jsx: require('./jsx-loader')
}
const {
    space,
    newLine
} = require('../new-line')

const codeBlockSym = ':::'
const codeSym = '\`\`\`'
const codeBlockReg = genReg(codeBlockSym)
const codeReg = genReg(codeSym)
let mdText;

function genReg(sym) {
    return `${sym}(${space}*)(.*)?(${newLine})((?:(?!(${sym})).)*(${newLine}))*${sym}`
}

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

module.exports = function (source) {
    const callback = this.async()
    const {
        frontmatter,
        headings,
        text
    } = parse(source);  // 解析frontmatter 和 headings
    mdText = text;
    const publicPath = this.query.publicPath || '/'
    const codeBlocks = mdText.match(new RegExp(codeBlockReg, 'g')) // 匹配所有代码块
    const linkMatches = mdText.match(/(!\[.*\]\()(.*)(\))/g) //匹配所有图片引用
    let demos = null;

    // 提取代码块，并解析成一个组件
    if (codeBlocks) {
        demos = codeParse(codeBlocks, frontmatter)
    } 

    // 根据图片地址，请求图片模块
    if(linkMatches) {
        Promise.all(linkMatches.map(link=>(
            new Promise((resolve,reject)=>{
                const matcher = link.match(/(!\[.*\]\()(.*)(\))/)
                this.loadModule(matcher[2], (err,result)=>{
                    if(err) {
                        reject(err)
                    }
                    const resolvedPath = result.split('+')[1].trim().slice(1,-2)
                    mdText = mdText.replace(link, `${matcher[1]}${publicPath}${resolvedPath}${matcher[3]}`)
                    resolve()
                })
            })
        ))).then(emitResult).catch(err=>{
            throw new Error(err)
        })
        return 
    }

    emitResult()

    function emitResult() {
        // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
        callback(null,`export default {
            ${
                JSON.stringify({
                    frontmatter: frontmatter,
                    headings:headings,
                    text: mdText
                }).replace(/\`/gm, '\\\`').slice(1,-1)
            },
            demos: ${demos ? demos : '[]'}
        }`)
    }

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
    getStr: ()=>{return mdText},
    setStr: (newStr)=>{mdText = newStr}
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