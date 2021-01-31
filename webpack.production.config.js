var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']

  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: './',
    filename: '[name]_[hash].js'
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],

    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          name: "vendor",
          chunks: "all",
          minChunks: 2,
          priority: 10,
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    definePlugin,
    new CleanWebpackPlugin(['build']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
      template: './src/index.html',
      // chunks: ['vendor', 'app'],
      // chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: true
    }),
    new CopyWebpackPlugin([
      // { from: 'assets', to: 'assets' },
      { from: 'src/manifest.json', to: './manifest.json' }
    ])
  ],
  module: {
    rules: [
      //babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      //style and css extract
      {
        test: [/.css$|.scss$/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader", {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('autoprefixer')({
              'browsers': ['> 1%', 'last 2 versions']
            })],
          }
        }]
      },
      //image file loader
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/img/",
              publicPath: '../../assets/img/'
            }
          }
        ]
      },
      //fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts/',
            publicPath: '../fonts'
          }
        }]
      },
      {
        test: /pixi\.js/,
        use: [
          {
            loader: 'expose-loader',
            options: {
              exposes: 'PIXI'
            }
          }
        ]
      },
      {

        test: require.resolve('phaser'),
        use: [
          {
            loader: 'expose-loader',
            options: {
              exposes: 'Phaser'
            }
          }
        ]
      },
      {
        test: /p2\.js/,
        use: [
          {
            loader: 'expose-loader',
            options: {
              exposes: 'p2'
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/assets/img'),
      '@': path.resolve(__dirname, 'src'),
      'Phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
