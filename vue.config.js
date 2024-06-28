const { defineConfig } = require('@vue/cli-service')
const nodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const path = require("path")

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new nodePolyfillPlugin()]
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/less/index.less")]
    }
  }
})
