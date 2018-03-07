module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      './src/tests/*.spec.js'
    ],
    // to avoid DISCONNECTED messages
    browserDisconnectTimeout : 100000, // default 2000
    browserDisconnectTolerance : 1, // default 0
    browserNoActivityTimeout : 60000, //default 10000
    exclude: [],
    preprocessors: {
      './src/tests/*.spec.js': ['webpack', 'sourcemap']
    },

    // webpack configuration
    webpack: {
      devtool: 'inline-source-map'
    },

    reporters: ['spec'],

    specReporter: {
      maxLogLines: 5,             // limit number of lines logged per test
      suppressErrorSummary: false, // do not print error summary
      suppressFailed: false,      // do not print information about failed tests
      suppressPassed: false,      // do not print information about passed tests
      suppressSkipped: false,      // do not print information about skipped tests
      showSpecTiming: true,      // print the time elapsed for each spec
      failFast: false              // test would finish with error when a first fail occurs.
    },

    // the default configuration
    htmlReporter: {
      outputFile: 'tests/units.html',

      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: 'Idp Proxy tests',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: true
    },

    plugins: ['karma-spec-reporter',
    'karma-webpack',
    'karma-sourcemap-loader',
    'karma-mocha', 'karma-chai',
    'karma-sinon',
    // 'karma-htmlfile-reporter',
    'karma-mocha-reporter',
    'karma-chrome-launcher'],

    // customDebugFile: './test/units.html',

    // customContextFile: './test/units.html',

    client: {
      mocha: {
        reporter: 'html'
      },
      captureConsole: true
    },

    port: 8080,
    hostname: 'localhost',
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeTravis'],

    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: [
          '--web-security=false',
          '--ignore-ssl-errors=true',
          '--disable-web-security',
          //'--disable-popup',
          '--disable-popup-blocking',
          '--ignore-certificate-errors'
        ]
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
