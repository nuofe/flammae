module.exports = function runWebpack(mode) {
    require(`./scripts/${mode}.js`)(); /* eslint-disable-line */
};
