module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
    env: {
        browser: true,
    },
    extends: ['plugin:vue/essential', 'standard'],
    // required to lint *.vue files
    plugins: ['vue'],
    rules: {
        'generator-star-spacing': 'off',
        indent: ['error', 4],
        'space-before-function-paren': ['error', 'never'], // 函数命名空格设置
        semi: ['off'], // 不强制是否末尾使用分号,原则上不加分号,在会出现 bug 的地方加
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'brace-style': [1, 'stroustrup'],
        'consistent-this': [2, 'self'], // this别名
        'comma-dangle': [1, 'only-multiline'], // 对象或数组后是否允许有逗号
        'no-sparse-arrays': 0,
    },
};
