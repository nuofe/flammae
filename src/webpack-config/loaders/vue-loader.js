/**
 * vue-loader
 * @param appSrc
 */
module.exports = function getVueLoader() {
    return {
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
    };
};
