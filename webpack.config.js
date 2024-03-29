'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';

  return {
    context: __dirname, // to automatically find tsconfig.json
    devtool: 'source-map',
    entry: './src/index.tsx',
    mode: 'development',
    output: {
      filename: 'assets/index.[hash].js'
    },
    performance: { hints: false },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          use: [
            {
              loader: 'tslint-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true // IMPORTANT! use transpileOnly mode to speed-up compilation
          }
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(sa|c)ss$/i,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.inline\.svg$/,
          loader: 'react-svg-loader'
        },
        {
          test: /^(?!.*\.inline\.svg$).*\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'assets/[name].[ext]',
            publicPath: function(url) {
              // cf. https://github.com/webpack-contrib/file-loader/issues/160#issuecomment-349771544
              return devMode ? url : url.replace(/assets/, '.');
            }
          }
        },
      ]
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js' ]
    },
    stats: {
      // suppress "export not found" warnings about re-exported types
      warningsFilter: /export .* was not found in/
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? "assets/index.css" : "assets/index.[hash].css"
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
      }),
      new HtmlWebpackPlugin({
        filename: 'mice-authoring.html',
        template: 'src/mice-authoring.html'
      }),
      new HtmlWebpackPlugin({
        filename: 'peas-authoring.html',
        template: 'src/peas-authoring.html'
      }),
      new CopyWebpackPlugin([
        {from: 'src/public'}
      ]),
      new CopyWebpackPlugin([{
        from: 'src/assets',
        to: 'assets'
      }]),
      new CopyWebpackPlugin([{
        from: 'src/components/spaces/organisms/organelles',
        to: 'organelles'
      }])
    ]
  };
};