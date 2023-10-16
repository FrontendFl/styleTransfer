module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2015
  },
  env: {
    browser: true, //预定义的全局变量，这里是浏览器环境
    node: true,
    commonjs: true,
    es6: true
  },
  globals: {
    $SUC: false,
    $GET: false,
    $MAP: false
  },
  extends: [
    //
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['import', 'vue', 'vuefix'],
  rules: {
    indent: ['error', 2], // 强制使用一致的缩进
    semi: ['error', 'never'], // 强制不使用分号
    quotes: ['error', 'single'], // 强制使用一致的单引号
    'comma-dangle': ['error', 'never'],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    'vue/no-v-html': 'off',
    'vue/comment-directive': 'off',
    'prettier/prettier': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off'
  }
}
