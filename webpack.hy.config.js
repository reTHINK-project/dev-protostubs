const path = require('path');

function getDist() {

  console.log('[name]')
}

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    "HelloWorldObserver.hy.ps": './src/hyperty/hello-world/HelloWorldObserver.hy.js'
  },
  output: {
    path: path.join(__dirname,  'dist/.well-known/hyperty' ),
    filename: '[name].js',
    libraryTarget: 'system'
  }
//  devtool: process.env.MODE === 'dev' ? 'inline-eval-cheap-source-map' : false,
/*  module: {
    rules: [
      { parser: { system: false } }
/*      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
},*/
};
