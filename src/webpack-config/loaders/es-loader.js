/* eslint-disable no-underscore-dangle */
// TODO: 如果项目根目录中存在 babelrc 配置， 做兼容处理
module.exports = function getEsLoader(appSrc) {
    const __PROD__ = process.env.NODE_ENV === 'production';

    return {
        test: /\.js$/,
        include: appSrc,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [require.resolve('@babel/preset-env')],
            // import() 动态语法支持
            plugins: [
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                [
                    // https://www.babeljs.cn/docs/babel-plugin-transform-runtime
                    // The transform-runtime transformer plugin does three things:
                    //     - Automatically requires @babel/runtime/regenerator when you use
                    //       generators/async functions (toggleable with the regenerator option).
                    //     - Can use core-js for helpers if necessary instead of assuming it will
                    //       be polyfilled by the user (toggleable with the corejs option)
                    //     - Automatically removes the inline Babel helpers and uses the module
                    //       @babel/runtime/helpers instead (toggleable with the helpers option).
                    //
                    // What does this actually mean though? Basically, you can use built-ins
                    // such as Promise, Set, Symbol, etc.,
                    // as well use all the Babel features that require a polyfill seamlessly,
                    // without global pollution, making it
                    // extremely suitable for libraries.
                    // Make sure you include @babel/runtime as a dependency.
                    require.resolve('@babel/plugin-transform-runtime'),
                    {
                        // "absoluteRuntime": false,

                        // The plugin defaults to assuming that all polyfillable APIs
                        // will be provided by the user. Otherwise the corejs option
                        // needs to be specified.
                        corejs: false,
                        // 设置为true, 将行内helpers转换成模块化引入，具体见：
                        // https://www.babeljs.cn/docs/babel-plugin-transform-runtime#helper-aliasing
                        helpers: true,
                        // 是否将generator functions 转换成 regenerator runtime 以避免全局污染，具体：
                        // https://www.babeljs.cn/docs/babel-plugin-transform-runtime#regenerator-aliasing
                        regenerator: true,
                        // es module
                        useESModules: true,
                    },
                ],
            ],
            // 启用缓存，这是webpack针对“babel-loader”的特性(不是babel本身的)。
            // 将会在./node_Module/.cache/babel-loader/目录中保存缓存结果
            // 对于多次的run build 会节省大量时间
            cacheDirectory: true,
            cacheCompression: __PROD__,
            compact: __PROD__,
        },
    };
};
