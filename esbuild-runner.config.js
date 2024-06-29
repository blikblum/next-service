module.exports = {
  esbuild: {
    tsconfigRaw: {
      include: ['index.js', 'tests/**/*.js'],
      compilerOptions: {
        target: 'esnext',
        experimentalDecorators: true,
      },
    },
    sourcemap: 'inline',
  },
}
