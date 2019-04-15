const path = require('path')
const fs = require('fs');


// 因为执行npm start的时候是在项目根目录，也就是工作目录是根目录，
// 所以process.cwd()返回的是根目录
const appRoot = fs.realpathSync(process.cwd());
function resolveApp(src) {
    return path.resolve(appRoot, src);
}

const flammaeRoot = path.resolve(__dirname, '../');
function resolveFlammae(src) {
    return path.resolve(flammaeRoot, src);
}


module.exports = {
    // 函数
    resolveApp: resolveApp,
    resolveFlammae: resolveFlammae,

    // flammae创建的项目的地址
    appRoot: appRoot,
    appSrc: resolveApp('src'),
    appBuild: resolveApp('build'),
    
    // flammae自己的地址
    flammaeRoot: flammaeRoot,
    flammaeSrc: resolveFlammae('src'),
    flammaePublic: resolveFlammae('public'),
    flammaeIndexJs: resolveFlammae('src/temp/index.js'),
    flammaeHtml: resolveFlammae('public/index.html'),
    flammaePackageJson: resolveFlammae('package.json'),
}