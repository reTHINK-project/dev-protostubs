const path = require('path');

function getDist() {

  console.log('[name]')
}

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    "rethink": './server/rethink.js'
  },
  output: {
    path: path.join(__dirname,  'dist' ),
    filename: '[name].js',
//    libraryTarget: 'system'
  },
  devtool: process.env.MODE === 'dev' ? 'inline-eval-cheap-source-map' : false,
 /* module: {
    rules: [
      { parser: { system: false } }
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
}*/
};
