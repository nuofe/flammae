module.exports = {
    extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
    settings: {
        react: {
            version: '>16.8',
        },
    },
    rules: {
        'no-console': 'off',
    },
};
