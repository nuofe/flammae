/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-01 13:10:11
 * @LastEditTime: 2019-05-03 13:46:51
 */

const path = require('path');
const fs = require('fs');


// 因为执行npm start的时候是在项目根目录，也就是工作目录是根目录，
// 所以process.cwd()返回的是根目录
const appRoot = fs.realpathSync(process.cwd());
function resolveApp(...src) {
    return path.resolve(appRoot, ...src);
}
const appCacheRoot = resolveApp('node_modules/.cache/flammae');
function resolveAppCache(src) {
    return path.resolve(appCacheRoot, src);
}

const flammaeRoot = path.resolve(__dirname, '../');
function resolveFlammae(src) {
    return path.resolve(flammaeRoot, src);
}


module.exports = {
    // 函数
    resolveApp,
    resolveAppSrc: resolveApp.bind(null, 'src'),
    resolveAppCache,
    resolveFlammae,

    // flammae创建的app的地址
    appRoot,
    appCacheRoot,
    appSrc: resolveApp('src'),
    appBuild: resolveApp('build'),

    // flammae创建的app的缓存地址
    appCacheTemp: resolveAppCache('temp'),
    appIndexJs: resolveAppCache('temp/index.js'),


    // flammae自己的地址
    flammaeRoot,
    flammaeSrc: resolveFlammae('templates'),
    flammaePublic: resolveFlammae('public'),
    flammaeHtml: resolveFlammae('public/index.html'),
    flammaePackageJson: resolveFlammae('package.json'),
};
