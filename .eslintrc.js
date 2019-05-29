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
        'max-len': ['warn', 150, {
            ignoreTrailingComments: true,
            comments: 200
        }],
    }
};
