module.exports = {
  esbuild: {
    loader: {
      '.js': 'ts',
    },
    tsconfigRaw: {
      compilerOptions: {
        target: 'es2019',
        experimentalDecorators: true,
      },
    },
    sourcemap: 'inline',
  },
}
