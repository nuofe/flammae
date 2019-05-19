/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-05-17 17:41:24
 */
const parse = require('../flammae-utils/markdown-parse');
const {
    space,
    newLine,
} = require('../flammae-utils/new-line');
const jsxLoader = require('../flammae-jsx-plugin/loader');

const codeBlockSym = ':::';
const codeSym = '```';
const codeBlockReg = genReg(codeBlockSym);
const codeReg = genReg(codeSym);
let mdText;

function genReg(sym) {
    return `${sym}(${space}*)(.*)?(${newLine})((?:(?!(${sym})).)*(${newLine}))*${sym}`;
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

module.exports = function compileMarkdown(source) {
    const callback = this.async();
    const {
        frontmatter,
        headings,
        text,
    } = parse(source); // 解析frontmatter 和 headings
    mdText = text;
    const publicPath = this.query.publicPath || '/';
    const codeBlocks = mdText.match(new RegExp(codeBlockReg, 'g')); // 匹配所有代码块
    const linkMatches = mdText.match(/(!\[.*\]\()(.*)(\))/g); // 匹配所有图片引用
    let demos = null;

    // 提取代码块，并解析成一个组件
    if (codeBlocks) {
        const loaderMap = Object.assign({}, {
            jsx: jsxLoader,
        }, this.query.loaders);
        demos = codeParse(codeBlocks, frontmatter, loaderMap);
    }

    // 根据图片地址，请求图片模块
    if (linkMatches) {
        Promise
            .all(linkMatches.map(link => (
                new Promise((resolve, reject) => {
                    const matcher = link.match(/(!\[.*\]\()(.*)(\))/);
                    this.loadModule(matcher[2], (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (!result) {
                            reject(new Error('you may need provide a src for image !'));
                            return;
                        }
                        const resolvedPath = result.split('+')[1].trim().slice(1, -2);
                        mdText = mdText.replace(link, `${matcher[1]}${publicPath}${resolvedPath}${matcher[3]}`);
                        resolve();
                    });
                })
            )))
            .then(emitResult)
            .catch((err) => {
                console.log(new Error(err));
                emitResult();
            });
        return;
    }

    emitResult();

    function emitResult() {
        // markdown中使用反引号包裹代码，在js中反引号为特殊符号，所以需要转义
        const resultText = `export default {
            ${JSON.stringify({ frontmatter, headings, text: mdText }).replace(/`/gm, '\\`').slice(1, -1)},
            demos: ${demos || '[]'}
        }`;
        callback(null, resultText);
    }
};


/**
 * 分析需要演示的代码
 * @param {array} codeBlocks
 * @param {*} options
 *
 */
// codeBlocks 是由下面格式的markdown文本组成的数组
// ::: only （不加 only 就显示demo和代码, 加了就只显示demo）
// 代码的一些说明写在这里
// ``` jsx
//  code here
// ```
// :::
//
const optObj = {
    getStr: () => mdText,
    setStr: (newStr) => {
        mdText = newStr;
    },
};

function codeParse(codeBlocks, options, loaderMap) {
    const str = codeBlocks.map((codeBlock) => {
    // 分离出
    // ``` jsx
    // code here
    // ```
        const codeWrapStr = codeBlock.match(codeReg)[0];
        // 分离出
        // ::: only
        // info text
        // :::
        const blockWrapStr = codeBlock.replace(codeWrapStr, '');
        //    语言   代码
        const [lang, code] = split(codeWrapStr, codeSym);
        //   演示指令     演示代码的附加信息
        const [command, codeNote] = split(blockWrapStr, codeBlockSym);

        // 判断是不是样式代码
        if (command.trim() === 'style') {
            mdText = mdText.replace(codeBlock, '\n\n');
            return `{
                        fn: function() {${code}},
                        isStyle: true
                    }`;
        }
        // 其它代码，用loader分析
        const compileCode = loaderMap[lang.trim()];
        let result = null;
        if (compileCode) {
            result = compileCode(
                {
                    code,
                    command: command.trim(),
                    codeWrapStr,
                    codeBlock,
                    codeNote,
                },
                options,
                optObj,
            );
        }

        if (!result) {
            return null;
        }
        return (
            `{
                lang: '${lang.trim()}',
                ${command.split(space).includes('only') ? '' : `code: \`${codeWrapStr.replace(/`/g, '\\`')}\`,`}
                codeNote: \`${codeNote.replace(/`/g, '\\`')}\`,
                loader : ${result}
            }`
        );
    }).filter(Boolean).join(',');

    return `[${str}]`;
}

function split(str, sym) {
    const arr = str.replace(new RegExp(sym, 'g'), '').match(new RegExp(`(.*)(${newLine})((.|${newLine})*)`));
    return [arr[1].trim(), arr[3]];
}
