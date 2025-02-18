module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'all',
  bracketSpacing: true,
  parser: 'typescript',
  endOfLine: 'auto',

  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['className'],
  overrides: [
    {
      files: ['*.json', '.*rc', '.jsonc'],
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
  ],
};
