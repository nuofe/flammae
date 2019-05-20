const { readFiles } = require('./utils');

const jsxParse = require('../packages/flammae-utils/jsx-parse');
const markdownParse = require('../packages/flammae-utils/markdown-parse');

/**
 * 读取`appRoot/src`文件夹下的内容，
 * `appRoot/src/docs`目录被规定专门存放`.md`文件，
 * `appRoot/src/pages`目录被规定专门存放`.jsx`文件，
 * 将会根据每个文档的头部信息生成对应的页面。
 *
 * `.md`文件通过在头部编写frontmatter来为flammae提供信息：
 * ```yaml
 * ---
 * path: '/doc-one'
 * ---
 * ```
 * .jsx文件通过在头部编写行级注释来为 flammae提供信息：
 * ```javascript
 * // path: '/page-one'
 * ```
 * @param {array} filePaths
 */
module.exports = async function parseFiles(filePaths) {
    const siteData = {
        pages: [],
        docs: [],
    };
    // if (!filePaths || (Array.isArray(filePaths) && filePaths.length === 0)) {
    //     startWepack();
    //     return;
    // }

    // read files
    console.log();
    console.log('正在读取文件...');
    await readFiles(filePaths).then((files) => {
        console.log();
        console.log('开始提取文件信息...');
        files.forEach((file) => {
            const isJSX = file.path.match(/.*\.jsx$/);
            if (isJSX) {
                const pageData = jsxParse(file.data, file.path);
                if (pageData) {
                    siteData.pages.push(
                        Object.assign({}, pageData, {
                            filePath: file.path,
                            _type: 'page',
                        }),
                    );
                }
            } else {
                const mdData = markdownParse(file.data, file.path);
                if (mdData) {
                    siteData.docs.push(
                        Object.assign({}, mdData.frontmatter, {
                            filePath: file.path,
                            _type: 'doc',
                        }),
                    );
                }
            }
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });

    return siteData;
};
