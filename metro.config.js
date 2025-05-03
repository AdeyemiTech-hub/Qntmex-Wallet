// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

// For Expo compatibility
let expoMetroConfig;
try {
  expoMetroConfig = require('expo/metro-config');
} catch (e) {
  // Expo metro config not available, using React Native config only
}

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Resolve the nested project structure issue
config.watchFolders = [
  path.resolve(__dirname),
  path.resolve(__dirname, 'qntmex-wallet')
];

// Handle potential module resolution conflicts
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'qntmex-wallet/node_modules')
];

module.exports = config;