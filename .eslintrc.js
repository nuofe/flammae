module.exports = {
    parserOptions: {
        sourceType: 'script',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
    settings: {
        react: {
            version: '>16.8',
        },
    },
    rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
    },
};
