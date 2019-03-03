const chalk = require('chalk')

// 针对不同平台判断，不同换行符。这里只匹配了 Windows
// windows \n\r
// unix \n
// mac \r
const newLineSym = '\r\n'
// 空格
const space = '(\u0020| )'
// frontmatter
const fmReg = `---${newLineSym}((${newLineSym}|.)*)${newLineSym}---`
// code
const codeReg = `\`\`\`(${space})*(.[^${newLineSym}]*)?${newLineSym}((?:(?!(\`\`\`)).)*${newLineSym})*\`\`\``
// heading
const headingReg = `(#|##|###|####)(.[^${newLineSym}]*)${newLineSym}`

module.exports = function (str, needWarning) {
    let frontmatter = null
    let codeSplit = []
    let headings = []

    // 提取 frontmatter
    const fmMatcher = str.match(new RegExp(fmReg))
    if (fmMatcher) {
        str = str.replace(fmMatcher[0], '')
        frontmatter = frontmatterParse(fmMatcher[1])
    }
    if (needWarning) {
        if (!frontmatter) {
            console.warn(chalk.yellow(`>>>>>>>>>>>>>>>>`))
            console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(needWarning)}文件中找到frontmatter，该文档将不被显示`)
            console.warn()
            return     
        } else if (!frontmatter.path) {
            console.warn(chalk.yellow(`>>>>>>>>>>>>>>>>`))
            console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(needWarning)}文件中找到路径（path）信息，该文档将不被显示`)
            console.warn()
            return
        }
    }


    // 提取代码块，并解析成一个组件
    const codeMatcher = str.match(new RegExp(codeReg, 'gm'))
    if (codeMatcher) {
        codeSplit = codeMatcher.map(codeParse).filter(Boolean)
    }

    // 提取标题
    const headingMatcher = str.match(new RegExp(headingReg, 'mg'))
    if (headingMatcher) {
        headings = headingMatcher.map(headingParse).filter(Boolean)
    }


    return {
        frontmatter: frontmatter,
        codeSplit: codeSplit,
        headings: headings,
        text: str
    }
}


// 解析frontmatter中的数据
function frontmatterParse(str) {
    const arr = str.replace(/('|")/gm, '').split(newLineSym).filter(Boolean)
    const obj = {}

    arr.forEach(item => {
        const subArr = item.split(':')
        obj[subArr[0].trim()] = subArr[1].trim()
    })
    return obj
}

// 解析文档标题
function headingParse(headingStr) {
    const subArr = headingStr.replace(new RegExp(newLineSym), '').split(/ +/)
    if (subArr.length) {
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
        text: codeStr.replace(arr[0], '')
    }
}