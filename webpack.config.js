const path = require('path');
const webpack = require('webpack');

const entry = path.resolve(__dirname, 'index.js');
const output = path.join(__dirname, 'dist');

module.exports = {
  devtool: 'eval-source-map',
  entry,
  output: {
    path: output,
    filename: 'script.js'
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
              presets: ['env'],
            }
          },
        ],
      },
    ],
  },
};