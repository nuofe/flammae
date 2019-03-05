const path = require('path')
const fs = require('fs');


// 因为执行npm start的时候是在项目根目录，也就是工作目录是根目录，
// 所以process.cwd()返回的是根目录
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(src) {
    return path.resolve(appDirectory, src)
}
const flameDirectory = path.resolve(__dirname, '../')

function resolveFlame(src) {
    return path.resolve(flameDirectory, src)
}


module.exports = {
    // 函数
    resolveApp: resolveApp,
    resolveFlame: resolveFlame,

    // flame创建的项目的地址
    appSrc: resolveApp('src'),
    appBuild: resolveApp('build'),
    
    // flame自己的地址
    flameDir: flameDirectory,
    flameSrc: resolveFlame('src'),
    flamePublic: resolveFlame('public'),
    flameIndexJs: resolveFlame('src/temp/index.js'),
    flameHtml: resolveFlame('public/index.html'),
    flamePackageJson: resolveFlame('package.json'),
}