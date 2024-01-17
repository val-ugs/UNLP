const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '..', './src/styles')], // absolute paths
              },
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: './media/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/resource',
        generator: {
          filename: './media/[name][ext]',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: './js/main.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(), // Clears the dist folder
    new DotEnv(), // Loads environment variables
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
    }), // Copies index.html to dist folder
    new MiniCssExtractPlugin({
      filename: './css/main.css',
    }), // Extracts CSS into separate files
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // Optimizes and minifies your CSS.
    ],
  },
  stats: 'errors-only',
};
