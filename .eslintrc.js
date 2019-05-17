module.exports = {
    extends: [
        'eslint-config-airbnb-base',
        'eslint-config-react-app',
    ],
    settings: {
        react: {
            version: '>16.8',
        },
    },
    rules: {
        'no-console': 'off',
        'indent': ['warn', 4],
    }
};
