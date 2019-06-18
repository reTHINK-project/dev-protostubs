const path = require('path')

module.exports = {
  entry: './fitness.strava.com.ps.js',
  output: {
    filename: 'fitness.strava.com.ps.js',
    path: path.resolve(__dirname, '../../../dist/.well-known/protocolstub'),
    libraryTarget: 'system'
  }
}