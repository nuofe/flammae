module.exports = function getSvgLoader() {
    return {
        test: /\.svg$/,
        loader: require.resolve('@svgr/webpack'),
    };
};
