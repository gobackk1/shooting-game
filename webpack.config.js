const webpack = require('webpack');
const path = require('path');

module.exports = {
  watch: true,
  entry: './script/src/app.js',
  output: {
    filename: 'app.bundle.js',
    path: path.join(__dirname, 'script')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env',
                {
                  modules: false,
                  targets: {
                    node: 'current',
                  },
                  useBuiltIns: "entry",
                  corejs: 2,
                }
              ]]
            }
          }
        ]
      },
    ]
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  },
};
