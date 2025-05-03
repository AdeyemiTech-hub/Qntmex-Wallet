/**
 * This script verifies the Android setup and provides instructions for running the app
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Android Setup Verification ===');
console.log('Root directory:', rootDir);
console.log('qntmex-wallet directory:', qntmexWalletDir);

// Check if qntmex-wallet directory exists
if (!fs.existsSync(qntmexWalletDir)) {
  console.error('ERROR: qntmex-wallet directory does not exist!');
  process.exit(1);
}

// Check if Android directory exists
if (!fs.existsSync(androidDir)) {
  console.log('\nAndroid directory does not exist in qntmex-wallet folder.');
  console.log('Please run the setup script first: node setup-android.js');
} else {
  console.log('\n✓ Android directory exists at:', androidDir);
  
  // Check if settings.gradle exists
  const settingsGradlePath = path.join(androidDir, 'settings.gradle');
  if (fs.existsSync(settingsGradlePath)) {
    console.log('✓ settings.gradle file exists');
  } else {
    console.log('WARNING: settings.gradle file is missing!');
  }
  
  // Check if build.gradle exists
  const buildGradlePath = path.join(androidDir, 'build.gradle');
  if (fs.existsSync(buildGradlePath)) {
    console.log('✓ build.gradle file exists');
  } else {
    console.log('WARNING: build.gradle file is missing!');
  }
}

console.log('\n=== Instructions to run the app ===');
console.log('1. Make sure you have an Android device connected or emulator running');
console.log('2. Run the following command from the root directory:');
console.log('   node run-android.js');
console.log('\nNote: This script will automatically:');
console.log('   1. Change to the qntmex-wallet directory');
console.log('   2. Run the correct command: npx expo run:android');
console.log('   3. Display any errors with troubleshooting steps');