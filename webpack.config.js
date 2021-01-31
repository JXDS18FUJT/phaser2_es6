const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: '[name].js',
    publicPath: ""
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({}), new OptimizeCSSAssetsPlugin()],
    splitChunks: {      // 打包 node_modules里的代码
      chunks: 'all',
      cacheGroups:{
        common: {
            name: "vendor",
            chunks: "all",
            minChunks: 2,
            priority: 10,
         }
    }
  },
  runtimeChunk: true,  // 打包 runtime 代码
  },
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'config.js', '.json'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@sprites': path.resolve(__dirname, 'src/sprites'),
      '@states':path.resolve(__dirname,'src/states'),
      '@': path.resolve(__dirname, 'src'),
      'Phaser': phaser,
      'pixi': pixi,
      'p2': p2

    },
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/styles.css"
    }),
    new HtmlWebpackPlugin({
      title: "Setting up webpack 4",
      template: "src/index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3005,
      server: { baseDir: ['dist'] }
    })
  ],
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  }
};