module.exports = function getFileLoader() {
    return {
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx)$/, /\.vue$/, /\.html$/, /\.json$/],
        options: {
            name: 'static/media/[name].[hash:8].[ext]',
        },
    };
};
