const babel = require("@babel/core")

module.exports =  (function () {
    let id = 0
    return function (obj, options, opt) {
        // const modules = options.modules
        // if (!modules || !Array.isArray(modules)) {
        //     console.log('你使用了demo功能，请确保frontmatter中存在modules属性，且为数组格式')
        //     console.log('即使在Demo中没使用modules，也需要将modules设置为[]')
        //     return null
        // }
        const key = `demo-wrapper-${id++}`
        opt.setStr(opt.getStr().replace(obj.codeBlock, `<div id='${key}'><\/div>\n\n`))
        // 解析 jsx
        const result = babel.transformSync(obj.code, {
            presets: ["@babel/preset-env", "@babel/preset-react"]
        })
        
        return `{
            elId: '${key}',
            fn: function() { ${result.code} ;return Demo;}
        }`
    }
})();