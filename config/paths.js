const path = require('path')
const {
    resolvePackage,
    resolveApp,
} = require('./devtool/utils');

const packageDirectory = path.resolve(__dirname, '../')


module.exports = {
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src'),

    packagePublic: resolvePackage('public'),
    packageHtml: resolvePackage('public/index.html'),
    packageIndexJs: resolvePackage('src/index.js'),
    packagePackageJson: resolvePackage('package.json'),
    packageSrc: resolvePackage('src'),
    packageStaticData: path.resolve(packageDirectory, 'scripts/static-data.js'), // 网站静态数据
    packageDir: packageDirectory,
    packageModules: resolvePackage('node_modules')
}