const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    producer: './src/producer.js',
    consumer: './src/consumer.js',
    metamask: './src/metamask.js',
    auth: './src/auth.js',
    login: './src/login.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'index.html',
      chunks: ['login', 'auth'],
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html', 
      filename: 'login.html',
      chunks: ['login', 'auth'],
    }),
    new HtmlWebpackPlugin({
      template: './public/producer.html',
      filename: 'producer.html',
      chunks: ['producer', 'metamask', 'auth'],
    }),
    new HtmlWebpackPlugin({
      template: './public/consumer.html',
      filename: 'consumer.html', 
      chunks: ['consumer', 'metamask', 'auth'],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'home.html',
      chunks: ['index', 'metamask', 'auth'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "http": false,
      "https": false,
      "zlib": false,
    }
  }
}; 