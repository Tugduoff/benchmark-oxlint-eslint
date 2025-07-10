module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    // Possible Problems
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-unreachable': 'warn',
    'no-constant-condition': 'warn',
    'no-duplicate-case': 'error',
    'no-empty': 'warn',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'warn',
    'no-extra-semi': 'warn',
    'no-func-assign': 'error',
    'no-irregular-whitespace': 'warn',
    'no-obj-calls': 'error',
    'no-sparse-arrays': 'warn',
    'no-unexpected-multiline': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    
    // Suggestions
    'no-alert': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-redeclare': 'error',
    'no-unused-expressions': 'warn',
    'no-useless-return': 'warn',
    'prefer-const': 'warn',
    'no-var': 'warn',
    
    // Layout & Formatting
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
    'space-before-blocks': 'warn',
    'space-in-parens': ['warn', 'never'],
    'space-infix-ops': 'warn',
    'eol-last': 'warn',
    'no-multiple-empty-lines': ['warn', { 'max': 2 }],
    'no-trailing-spaces': 'warn',
    
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'no-implicit-globals': 'error',
    'no-magic-numbers': ['warn', { 'ignore': [0, 1, -1] }],
    'no-multi-spaces': 'warn',
    'no-return-assign': 'error',
    'no-self-compare': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-use-before-define': 'error',
    'radix': 'error',
    'yoda': 'error',
    
    // ES6
    'arrow-spacing': 'warn',
    'constructor-super': 'error',
    'no-class-assign': 'error',
    'no-const-assign': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-new-symbol': 'error',
    'no-this-before-super': 'error',
    'no-useless-computed-key': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-rename': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',
    'rest-spread-spacing': 'warn',
    'template-curly-spacing': 'warn',
    'yield-star-spacing': 'warn'
  }
};
