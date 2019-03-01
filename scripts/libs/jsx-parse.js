const newLineSym = '\r\n'
const fmReg = `\/\/(\s)*(.[^${newLineSym}]*)(\s)*:(\s)*(.[^${newLineSym}]*)${newLineSym}`

module.exports = function (str) {
    const fmMatcher = str.match(new RegExp(fmReg, 'gm'))
    const pageData = null
    console.log(fmMatcher)
    if(fmMatcher) {
        fmMatcher.forEach(str=>{
            str.replace(new RegExp(`${newLineSym}|\/\/`), '')
        })
    }

}