module.exports = {
  root: true,
  plugins: ["prettier", "@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "error",
    "no-console": ["error", { allow: ["error", "warn", "debug"] }],
    "no-restricted-imports": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    // Application
    {
      files: ["src/**/*.{ts,tsx}"],
      plugins: ["deprecation", "prettier", "@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parserOptions: {
        project: "tsconfig.json",
      },
      rules: {
        "deprecation/deprecation": "error",
        // Disabled rules; we might re-enable them later
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          { allowNumber: true, allowNullish: true },
        ],
      },
    },

    // Configuration files
    {
      files: ["./*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
