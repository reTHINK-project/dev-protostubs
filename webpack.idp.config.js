const path = require('path');

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    "strava.com.idp": './src/idpproxy/strava/strava.com.idp.js',
    "google.com.idp": './src/idpproxy/google/google.com.idp.js',
    "edpdistribuicao.pt.idp": './src/idpproxy/edp/edpdistribuicao.pt.idp.js',
    "facebook.com.idp": './src/idpproxy/facebook/facebook.com.idp.js',
    "microsoft.com.idp": './src/idpproxy/microsoft/microsoft.com.idp.js',
    "mobie.pt.idp": './src/idpproxy/mobi.e/mobie.pt.idp.js',
    "sip.rethink-project.eu.idp": './src/idpproxy/sip.rethink-project.eu/sip.rethink-project.eu.idp.js',
    "slack.com.idp": './src/idpproxy/slack/slack.com.idp.js'
  },
  output: {
    path: path.join(__dirname, 'dist/.well-known/idp-proxy'  ),
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
