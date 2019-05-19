const fs = require('fs-extra');
const {
    templateAppJsx,
    templateHomeJsx,
    templateContentJsx,

    tempAppJsx,
    
    appHomeFile,
    appContentFile,
} = require('./paths');
const {
    resolvePath,
    pathExistSync,
} = require('./utils');


module.exports = function writeTempAppFileSync(siteData) {

    try {
        // 读取 模板 app.jsx 文件
        let appFileText = fs.readFileSync(templateAppJsx, { encoding: 'utf8' });
        // 写入Index.jsx，作为首页
        appFileText = insertImport(
            appFileText,
            pathExistSync(appHomeFile)
                ? resolvePath(appHomeFile)
                : resolvePath(templateHomeJsx),
            'Index',
        );
        // 如果存在 docs，写入必要信息
        if (siteData.docs.length) {
            appFileText = insertImport(
                appFileText,
                pathExistSync(appContentFile)
                    ? resolvePath(appContentFile)
                    : resolvePath(templateContentJsx),
                'Content',
            );
            appFileText = insertImport(
                appFileText,
                resolvePath(resolveFlammae('templates/markdown')),
                'Markdown',
            );
        }
        // 写入docs及pages的路由
        siteData.pages.concat(siteData.docs).forEach((item, i) => {
            const isDoc = item._type === 'doc'; /* eslint-disable-line */
            const name = isDoc ? `Md${i}` : `Comp${i}`;
            appFileText = insertImport(appFileText, resolvePath(item.filePath), name);
            const render = !isDoc
                ? `component={${name}}`
                : `render={()=><Content renderMarkdown={()=><Markdown md={${name}}/>} data={${name}}/>}`;
            appFileText = insertRoute(render, item.path, appFileText);
        });

        // 生成 app.jsx
        fs.writeFileSync(tempAppJsx, appFileText);
    } catch (err) {
        console.error(err);
        process.exit(0);
    }
};

exports.insertImport = insertImport;

function insertImport(target, path, name) {
    if (name) {
        // import module from 'module-path'
        return target.replace('/* import */', `import ${name} from '${path}';\n/* import */`);
    }
    // import 'module-path'
    return target.replace('/* import */', `import '${path}';\n/* import */`);
}

/**
 * 向Router中插入 <Route path=""  component={}/>
 * @param {*} render 
 * @param {*} path 
 * @param {*} target 
 */
function insertRoute(render, path, target) {
    return target.replace('{/* route */}', `<Route path='${path}' ${render} />\n{/* route */}`);
}
