const parse = require('./parse')

module.exports = function (str) {
        const obj = parse(str)
        // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
        return `export default {${JSON.stringify(obj).replace(/\`/gm, '\\\`').slice(1,-1)}}`
}