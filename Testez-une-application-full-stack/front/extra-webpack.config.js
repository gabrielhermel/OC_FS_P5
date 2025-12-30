module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        enforce: 'post',
        use: {
          loader: '@jsdevtools/coverage-istanbul-loader',
          options: { esModules: true },
        },
        exclude: [
          /node_modules/,
          /\.spec\.js$/,
          /\.spec\.ts$/,
          /cypress/,
          /polyfills/,
          /test/,
          /main\.ts$/,
          /environment/,
        ],
      },
    ],
  },
};