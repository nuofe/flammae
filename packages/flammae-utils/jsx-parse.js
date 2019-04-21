/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description: 
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:33:11
 */

const chalk = require('chalk')
const {space, newLine} = require('./new-line')
const fmReg = `\/\/(${space}*)([A-z]+)(${space}*):(${space}*)('(.[^'"]+)'|"(.[^'"]+)")(${space}*)(${newLine})?`

module.exports = function (str, filePath) {
    const fmMatcher = str.match(new RegExp(fmReg, 'mg'))
    let pageData = null
    if (fmMatcher) {
        pageData = {}
        fmMatcher.forEach(str => {
            const arr = str.replace(new RegExp(`${newLine}|\/\/`), '').split(':')
            pageData[arr[0].trim()] = arr[1].trim().replace(/'|"/gm, '')
        })
    }

    if (!pageData) {
        console.warn(chalk.yellow(`>>>>>>>>>>>>>>>>`))
        console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(filePath)}文件中找到有效注释，该文档将不被显示`)
        console.warn()

        return
    } else if (!pageData.path) {
        console.warn(chalk.yellow(`>>>>>>>>>>>>>>>>`))
        console.warn(`${chalk.yellow(`注意：`)}未能从${chalk.yellow(filePath)}文件头部的注释中找到路径（path）信息，该文档将不被显示`)
        console.warn()
        return
    }

    return pageData

}