const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: {
      rewrites: [
        {from: /^\/$/, to: '/index.html'},
        {from: /^\/login/, to: '/index.html'},
      ]
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new Dotenv({
      path: './.env'
    })
  ],
  module: {
    rules: [
      {test: /\.css$/, loader: "style-loader!css-loader?importLoaders=1"},
      {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['babel-plugin-transform-class-properties', '@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  }
};
