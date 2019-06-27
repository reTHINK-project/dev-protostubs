const path = require('path');

function getDist() {

  console.log('[name]')
}

// 'src/sandbox.js', 'src/minibus.js'
module.exports = {
  entry: {
    "Connector.hy": './src/hyperty/connector/Connector.hy.js',
    "HelloWorldObserver.hy": './src/hyperty/hello-world/HelloWorldObserver.hy.js',
    "HelloWorldReporter.hy": './src/hyperty/hello-world/HelloWorldReporter.hy.js',
    "DeviceManager.hy": './src/hyperty/device-manager/DeviceManager.hy.js',
    "DTWebRTC.hy": './src/hyperty/dtwebrtc/DTWebRTC.hy.js',
    "GroupChatManager.hy": './src/hyperty/group-chat-manager/GroupChatManager.hy.js',
    "ElearningPlayer.hy": './src/hyperty/learning/ElearningPlayer.hy.js',
    "LocationObserver.hy": './src/hyperty/location/LocationObserver.hy.js',
    "LocationReporter.hy": './src/hyperty/location/LocationReporter.hy.js',
    "UserKwhObserver.hy": './src/hyperty/observer-kwh/UserKwhObserver.hy.js',
    "SimpleChat.hy": './src/hyperty/simple-chat/SimpleChat.hy.js',
    "UserActivityObserver.hy": './src/hyperty/user-activity/UserActivityObserver.hy.js',
    "UserAvailabilityObserver.hy": './src/hyperty/user-availability/UserAvailabilityObserver.hy.js',
    "UserAvailabilityReporter.hy": './src/hyperty/user-availability/UserAvailabilityReporter.hy.js',
    "Wallet.hy": './src/hyperty/wallet/Wallet.hy.js'
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
