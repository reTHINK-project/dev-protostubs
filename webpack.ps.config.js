const path = require('path');

function getDist() {

  console.log('[name]')
}

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    "fitness.google.com.ps": './src/protostub/google/fitness.google.com.ps.js',
    "sip.rethink-project.eu.ps": './src/protostub/ims_iw/sip.rethink-project.eu.ps.js',
    "P2PHandlerProtoStub.ps": './src/protostub/p2p/P2PHandlerProtoStub.ps.js',
    "P2PRequesterProtoStub.ps": './src/protostub/p2p/P2PRequesterProtoStub.ps.js',
    "slack.slack.com.ps": './src/protostub/slack/slack.slack.com.ps.js',
    "fitness.strava.com.ps": './src/protostub/strava/fitness.strava.com.ps.js',
    "default.ps": './src/protostub/vertx/default.ps.js',
    "sharing-cities-dsm.ps": './src/protostub/vertx_app_stub/sharing-cities-dsm.ps.js'
  },
  output: {
    path: path.join(__dirname,  'dist/.well-known/protocolstub' ),
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
