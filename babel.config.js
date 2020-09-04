module.exports = {
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: false,
        decoratorsBeforeExport: false
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ]
  ]
}
