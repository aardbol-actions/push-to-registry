const tseslint = require("typescript-eslint");
const js = require("@eslint/js");

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    rules: {
      "array-bracket-spacing": [2, "always", { objectsInArrays: false, arraysInArrays: false }],
      "array-bracket-newline": [2, "consistent"],
      "brace-style": [2, "stroustrup", { allowSingleLine: true }],
      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "only-multiline",
      }],
      curly: 2,
      "default-case-last": 2,
      eqeqeq: [2, "smart"],
      "func-names": [2, "as-needed"],
      indent: [2, 4],
      "max-len": [2, 120, 4, {
        ignoreRegExpLiterals: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreUrls: true,
      }],
      "no-constructor-return": 2,
      "no-console": 2,
      "no-else-return": [2, { allowElseIf: true }],
      "no-invalid-this": 2,
      "no-multi-spaces": [2, { ignoreEOLComments: true }],
      "no-use-before-define": [2, { functions: false, classes: false }],
      quotes: [2, "double", { allowTemplateLiterals: true }],
      "spaced-comment": [2, "always", { block: { exceptions: ["*"] } }],

      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
        },
        {
          selector: "LabeledStatement",
          message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
        },
        {
          selector: "WithStatement",
          message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
        },
      ],

      "no-shadow": "error",
      "no-useless-constructor": "error",
      semi: "error",

      "arrow-body-style": 0,
      "lines-between-class-members": 0,
      "no-await-in-loop": 0,
      "no-continue": 0,
      "no-underscore-dangle": 0,
      "no-inner-declarations": 0,
      "no-plusplus": 0,
      "padded-blocks": 0,
      "prefer-destructuring": 0,
      "prefer-template": 0,

      "@typescript-eslint/explicit-function-return-type": [2, { allowExpressions: true }],
      "@typescript-eslint/no-base-to-string": 2,
      "@typescript-eslint/no-floating-promises": 2,
      "@typescript-eslint/no-inferrable-types": [2, { ignoreParameters: true }],
      "@typescript-eslint/no-require-imports": 2,
      "@typescript-eslint/no-unused-vars": [2, { argsIgnorePattern: "(^_)", caughtErrorsIgnorePattern: "(^_)" }],
      "@typescript-eslint/no-unnecessary-condition": 2,
      "@typescript-eslint/prefer-for-of": 2,
      "@typescript-eslint/prefer-readonly": 2,
      "@typescript-eslint/prefer-string-starts-ends-with": 2,
      "@typescript-eslint/strict-boolean-expressions": [2, { allowNumber: false, allowAny: true, allowNullableBoolean: true, allowNullableString: true }],
      "@typescript-eslint/switch-exhaustiveness-check": 2,
      "@typescript-eslint/typedef": [2, { parameter: true }],

      "@typescript-eslint/no-namespace": 0,
    },
  },
  {
    ignores: ["dist/", "node_modules/", "out/", "lib/", ".eslintrc.js", "eslint.config.js"],
  },
);
