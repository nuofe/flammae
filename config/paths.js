const path = require('path')
const fs = require('fs');
// const mFs = new require('memory-fs')()

// 因为执行npm start的时候是在项目根目录，也就是工作目录是根目录，
// 所以process.cwd()返回的是根目录
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(src) {
    return path.resolve(appDirectory, src)
}

module.exports = {
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/index.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appStaticData: path.resolve(appDirectory, 'scripts/static-data.js'), // 网站静态数据
}