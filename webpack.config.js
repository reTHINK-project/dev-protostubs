var path = require('path');
var webpack = require('webpack');

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    NodejsProxyStub: './src/idpproxy/google/NodejsProxyStub.js'
  },
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'system'
//    libraryTarget: 'umd',
//    umdNamedDefine: true
  },
  devtool: process.env.MODE === 'dev' ? 'inline-eval-cheap-source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
};
