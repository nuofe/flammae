/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description: 
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:33:06
 */

const chalk = require('chalk')

const {
    newLine,
    space
} = require('../new-line')

// frontmatter
const fmReg = `---(?:${newLine})((${newLine}|.)*)(?:${newLine})---`
// heading
const headingReg = `(#{1,5})${space}+(.+)(?:${newLine})`

module.exports = function (str, needWarning) {
    let frontmatter = null
    let headings = []

    // 提取 frontmatter

    const fmMatcher = str.match(new RegExp(fmReg))
    if (fmMatcher) {
        // 截掉的frontmatter
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


    // 提取标题
    const headingMatcher = str.match(new RegExp(headingReg, 'g'))

    if (headingMatcher) {
        headings = headingMatcher.map(headingParse).filter(Boolean)
    }

    return {
        frontmatter: frontmatter,
        headings: headings,
        text: str
    }
}


// 解析frontmatter中的数据
function frontmatterParse(str) {
    const arr = str.match(/.*/g).filter(Boolean)
    const obj = {}
    arr.forEach(item => {
        const subArr = item.split(':')
        try{
            obj[subArr[0].trim()] = eval(subArr[1].trim())
        }catch(err){
            console.log(`\n${chalk.red('frontmatter格式不正确！')}\n`)
        }
    })
    return obj
}

// 解析文档标题 
// # title
// ## title
function headingParse(headingStr) {
    const subArr = headingStr.match(new RegExp(headingReg))
    if (subArr) {
        return {
            level: subArr[1].length,
            text: subArr[3]
        }
    }
}

