// C:\Users\USER\Desktop\vid\qntmex Wallet\react-native.config.js
module.exports = {
  project: {
    android: {
      sourceDir: './qntmex-wallet/android',
    },
  },
  // Add additional configuration to help with module resolution
  resolver: {
    extraNodeModules: {
      'react-native': __dirname + '/node_modules/react-native',
    },
  },
};