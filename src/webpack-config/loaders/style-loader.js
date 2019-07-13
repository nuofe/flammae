/* eslint-disable no-underscore-dangle */
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离 css
const postcssFlexbugsFixs = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');


const cssRegExp = /\.css$/;
const cssModuleRegExp = /\.module\.css$/;
const lessRegExp = /\.less$/;
const lessModuleRegExp = /\.module\.less$/;
const sassRegExp = /\.(sass|scss)$/;
const sassModuleRegExp = /\.module\.(sass|scss)$/;
/**
 * 模块 .module.(css|less) 中的类名转换形式
 */
const localIdentName = '[name]_[hash:base64:5]';


/**
 * 对不同文件.css .module.css .less .module.less
 * 生成基础的loaders
 */
function getBaseStyleLoaders(
    cssLoaderOptions = {},
    config,
) {
    const {
        mode,
        px2rem,
        // isVueApp,
        publicPath,
    } = config;
    const __DEV__ = mode === 'development';
    const __PROD__ = mode === 'production';


    /**
     * css-loader的配置
     */
    const mergedCssLoaderOptions = {
        importLoaders: 1,
        modules: false,
        sourceMap: __PROD__, // 生产环境再启用map, 开发时禁用优化打包响应速度
        ...cssLoaderOptions,
    };

    /**
     * 如果是移动端项目，需要在css-loader前增加一个px2rem-loader，
     * 所以css-loader的importLoaders 要增加 1
     */
    if (px2rem) {
        mergedCssLoaderOptions.importLoaders += 1;
    }


    return [
        // 将解析后的css通过style标签写入 html
        __DEV__ && require.resolve('style-loader'),

        // isVueApp && require.resolve('vue-style-loader'),

        __PROD__ && ({
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath,
            },
        }),
        {
            loader: require.resolve('css-loader'),
            options: mergedCssLoaderOptions,
        },
        px2rem && ({
            loader: require.resolve('px2rem-loader'),
            // options here
            options: {
                remUnit: 37.5,
                remPrecision: 6, // 精度
            },
        }),
        {
            // TODO: autoprefixer 解耦
            // https://www.npmjs.com/package/postcss-loader#plugins
            loader: require.resolve('postcss-loader'),
            options: {
                ident: 'postcss',
                plugins: () => [
                    // pc端，暂时也没用 ie9 不支持flex
                    postcssFlexbugsFixs,
                    postcssPresetEnv({
                        stage: 3,
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                    }),
                ],
            },
        },
    ].filter(Boolean);
}


/**
 * 生成扩展语言的 完整 规则
 *
 * @param styleConfig
 * @param options
 */
function genExtensionStyleLoaders(
    options,
    styleConfig = {},
) {
    const {
        regExp,
        moduleRegExp,
        loaderName,
    } = styleConfig;
    const {
        appNodeModulesPath,
        ownNodeModulesPath,
    } = options;

    if (!loaderName || !regExp) {
        return [];
    }

    const __PROD__ = process.env.NODE_ENV === 'production';

    /**
     * 扩展语言的loader
     */
    const extendLoader = {
        loader: require.resolve(loaderName, {
            paths: [
                ownNodeModulesPath,
                appNodeModulesPath,
            ],
        }),
        options: {
            sourceMap: __PROD__,
        },
    };

    /**
     * 扩展语言 rules
     */
    return [
        {
            test: regExp,
            exclude: moduleRegExp || null,
            use: getBaseStyleLoaders({
                importLoaders: 2,
            }, options).concat(extendLoader),
        },
        moduleRegExp && {
            test: moduleRegExp,
            use: getBaseStyleLoaders({
                importLoaders: 2,
                modules: true,
                localIdentName,
            }, options).concat(extendLoader),
        },
    ].filter(Boolean);
}

/**
 * 根据用户自定义的选项，生成css扩展语言解析规则
 */
const genCustomStyleLoaders = function genCustomStyleLoaders(
    options,
    styleConfig = {},
) {
    const {
        lang,
        regExp,
        loaderName,
    } = styleConfig;

    /**
     * 如果没提供语言名，则不做操作
     * 默认提供了less， 不需要重复创建less loader
     */
    if (!lang || lang === 'less') {
        return [];
    }

    /**
     * 如果是sass, 可以不提供 regExp loaderName这些选项
     */
    if (['sass', 'scss'].includes(lang)) {
        return genExtensionStyleLoaders(options, {
            regExp: sassRegExp,
            moduleRegExp: sassModuleRegExp,
            loaderName: loaderName || 'sass-loader',
        });
    }

    /**
     * 想处理除了less sass 外的其它预处理语言，但是未提供 loaderName，
     * 报错
     */
    if (!loaderName || !regExp) {
        throw new Error(`cannot know what loader to use to handle .${lang} file.`);
    }
    return genExtensionStyleLoaders(options, styleConfig);
};

/**
 * 默认支持 .css .module.css .less .module.less loader
 * 如果用户可以通过配置来启动其它loader
 */
module.exports = function getStyleLoader(
    options,
    styleConfig,
) {
    /**
     * 用户指定的其它扩展语言的 rules
     */
    const customStyleLoaders = styleConfig ? genCustomStyleLoaders(options, styleConfig) : [];

    return {
        oneOf: [
            /**
             * 普通css文件
             */
            {
                test: cssRegExp,
                exclude: cssModuleRegExp,
                use: getBaseStyleLoaders(null, options),
            },
            {
                test: cssModuleRegExp,
                use: getBaseStyleLoaders({
                    modules: true,
                    localIdentName,
                }, options),
            },

            /**
             * less文件
             */
            ...genExtensionStyleLoaders(options, {
                regExp: lessRegExp,
                moduleRegExp: lessModuleRegExp,
                loaderName: 'less-loader',
            }),

            /**
             * 用户自定义预处理语言
             */
            ...customStyleLoaders,
        ].filter(Boolean),
    };
};
