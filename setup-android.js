/**
 * This script helps initialize the Android project structure for React Native
 * Run with: node setup-android.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

// Check if Android directory exists
if (!fs.existsSync(androidDir)) {
  console.log('Android directory does not exist. Creating it...');
  
  try {
    // Change to the qntmex-wallet directory
    process.chdir(qntmexWalletDir);
    console.log('Changed directory to:', process.cwd());
    
    // Run the command to create Android project
    console.log('Initializing Android project with npx...');
    execSync('npx expo prebuild --platform android', { stdio: 'inherit' });
    
    console.log('\nAndroid project created successfully!');
  } catch (error) {
    console.error('Error creating Android project:', error.message);
    console.log('\nManual steps to create Android project:');
    console.log('1. Navigate to the qntmex-wallet directory: cd qntmex-wallet');
    console.log('2. Run: npx expo prebuild --platform android');
  }
} else {
  console.log('Android directory already exists at:', androidDir);
}

// Verify native_modules.gradle exists
const nativeModulesPath = path.join(rootDir, 'node_modules', 'react-native', 'android', 'native_modules.gradle');
if (fs.existsSync(nativeModulesPath)) {
  console.log('\nnative_modules.gradle exists at:', nativeModulesPath);
} else {
  console.log('\nWARNING: native_modules.gradle is still missing!');
  console.log('Try reinstalling React Native with:');
  console.log('1. npm uninstall react-native');
  console.log('2. npm install react-native@0.72.10');
}

console.log('\nSetup complete. You can now try running your project with:');
console.log('npx react-native run-android');