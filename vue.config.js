const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  css: {
    extract: true,
    sourceMap: true
  },

  assetsDir: 'assets',
  outputDir: 'dist'
})
