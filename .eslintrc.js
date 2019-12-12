module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  'extends': [
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: [1, 2, {"SwitchCase": 1}],
    quotes: [1, "single", {"allowTemplateLiterals": true}],
    semi: [1, "always"],
    "comma-dangle": ["error", "never"],
    "prefer-const": [1],
    "space-infix-ops": ["error"],
    "comma-spacing": [1, { "before": false, "after": true }],
    "arrow-spacing": [1, { "before": true, "after": true }],
    "no-unused-vars": [1, { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
