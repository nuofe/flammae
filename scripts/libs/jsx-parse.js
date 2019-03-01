const chalk = require('chalk')

const newLineSym = '\r\n'
const space = '(\u0020| )'
const fmReg = `\/\/(${space}*)([A-z]+)(${space}*):(${space}*)('(.[^'"]+)'|"(.[^'"]+)")(${space}*)(${newLineSym})?`

module.exports = function (str, filePath) {
    const fmMatcher = str.match(new RegExp(fmReg, 'mg'))
    let pageData = null
    if (fmMatcher) {
        pageData = {}
        fmMatcher.forEach(str => {
            const arr = str.replace(new RegExp(`${newLineSym}|\/\/`), '').split(':')
            pageData[arr[0].trim()] = arr[1].trim().replace(/'|"/gm, '')
        })
    }

    if (!pageData) {
        console.warn(chalk.yellow(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>>>>>>`))
        console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(filePath)}文件中找到有效注释，该文档将不被显示`)
        console.warn(chalk.yellow(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>>>>>>\n`))
        return
    } else if (!pageData.path) {
        console.warn(chalk.yellow(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>>>>>>`))
        console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(filePath)}文件头部的注释中找到路径（path）信息，该文档将不被显示`)
        console.warn(chalk.yellow(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>>>>>>>>>>>>>>>>\n`))
        return
    }

    return pageData

}