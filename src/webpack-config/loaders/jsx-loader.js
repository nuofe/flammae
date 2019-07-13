/* eslint-disable no-underscore-dangle */
// TODO: 适配
// TODO: 如果项目根目录中存在 babelrc 配置， 做兼容处理
module.exports = function getJsxLoader(appSrc) {
    const __PROD__ = process.env.NODE_ENV === 'production';
    return {
        test: /\.(js|jsx)$/,
        include: appSrc,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [require.resolve('babel-preset-react-app')],
            // import() 动态语法支持
            plugins: [require.resolve('@babel/plugin-syntax-dynamic-import')],
            // 启用缓存，这是webpack针对“babel-loader”的特性(不是babel本身的)。
            // 将会在./node_Module/.cache/babel-loader/目录中保存缓存结果
            // 对于多次的run build 会节省大量时间
            cacheDirectory: true,
            cacheCompression: __PROD__,
            compact: __PROD__,
        },
    };
};
