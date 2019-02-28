// 针对不同平台判断，不同换行符。这里只匹配了 Windows
// windows \n\r
// unix \n
// mac \r
const newLineSym = '\r\n'

module.exports = function (str) {
        let frontmatter = null
        let codeSplit = []
        let headings = []

        // 提取 frontmatter
        const fmReg = `---${newLineSym}((${newLineSym}|.)*)${newLineSym}---`
        const fmMatcher = str.match(new RegExp(fmReg))
        if (fmMatcher) {
            str = str.replace(fmMatcher[0], '')
            frontmatter = frontmatterParse(fmMatcher[1])
        }


        // 提取代码块，并解析成一个组件
        const codeReg = `\`\`\`(\s)*(.[^${newLineSym}]*)?${newLineSym}((?:(?!(\`\`\`)).)*${newLineSym})*\`\`\``
        const codeMatcher = str.match(new RegExp(codeReg, 'gm'))
        console.log(codeMatcher)
        if (codeMatcher) {
            codeSplit = codeMatcher.map(codeParse).filter(Boolean)
        }

        // 提取标题
        const headingReg = `(#|##|###|####)(.[^${newLineSym}]*)${newLineSym}`
        const headingMatcher = str.match(new RegExp(headingReg, 'mg'))
        if (headingMatcher) {
            headings = headingMatcher.map(headingParse).filter(Boolean)
        }

        // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
        return `export default {
            frontmatter: ${JSON.stringify(frontmatter)},
            codeSplit: ${JSON.stringify(codeSplit)},
            headings: ${JSON.stringify(headings)},
            text: \`${str.replace(/\`/gm,'\\\`')}\`
        }`
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

// 解析标题
function headingParse(headingStr) {
    const subArr = headingStr.replace(new RegExp(newLineSym), '').split(/ +/)
        if(subArr.length) {
            return {
                level: subArr[0].length,
                text: subArr[1]
            }
        }
}

// 解析代码块 '```jsx\r\nconstructor() {\r\n\r\n}\r\n\r\nrender() {\r\n    \r\n}\r\n```'
function codeParse(codeStr) {
    codeStr = codeStr.replace(/```/mg, '')
    const arr = codeStr.split(newLineSym)
    return {
        lang: arr[0].trim(),
        text: codeStr.replace(arr[0],'')
    }
}