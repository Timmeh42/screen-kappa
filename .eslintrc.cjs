/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        'plugin:@stylistic/all-extends',
        '@vue/eslint-config-typescript',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['@stylistic'],
    rules: {
        '@stylistic/array-element-newline': ['error', 'consistent'],
        '@stylistic/comma-dangle': ['error', 'always-multiline'],
        '@stylistic/dot-location': ['error', 'property'],
        '@stylistic/function-call-argument-newline': ['error', 'consistent'],
        '@stylistic/max-len': ['off'],
        '@stylistic/multiline-ternary': ['error', 'always-multiline'],
        '@stylistic/object-curly-spacing': ['error', 'always'],
        '@stylistic/padded-blocks': ['error', 'never'],
        '@stylistic/quote-props': ['error', 'as-needed'],
        '@stylistic/quotes': ['error', 'single'],
    },
};
