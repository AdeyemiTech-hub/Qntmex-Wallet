/**
 * This script helps run the Android app with the correct command structure
 * Run with: node run-android.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Android Runner ===');
console.log('Root directory:', rootDir);

// Check if qntmex-wallet directory exists
if (!fs.existsSync(qntmexWalletDir)) {
  console.error('ERROR: qntmex-wallet directory does not exist!');
  process.exit(1);
}

// Check if Android directory exists
if (!fs.existsSync(androidDir)) {
  console.log('\nAndroid directory does not exist in qntmex-wallet folder.');
  console.log('Please run the setup script first: node setup-android.js');
  process.exit(1);
}

try {
  // Change to the qntmex-wallet directory
  process.chdir(qntmexWalletDir);
  console.log('Changed directory to:', process.cwd());
  
  // Run the command to start the Android app
  console.log('\nStarting Android app...');
  console.log('This may take a few minutes. Please be patient.');
  
  // Use the correct command for running the Android app
  execSync('npx expo run:android', { stdio: 'inherit' });
  
} catch (error) {
  console.error('\nError running Android app:', error.message);
  console.log('\nTroubleshooting steps:');
  console.log('1. Make sure you have Android Studio installed and configured');
  console.log('2. Ensure you have an Android device connected or emulator running');
  console.log('3. Try running the setup script again: node setup-android.js');
  console.log('4. Check if your Android SDK is properly configured');
}