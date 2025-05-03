/**
 * This script provides advanced troubleshooting for Android build issues
 * Run with: node troubleshoot-android.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Advanced Android Troubleshooter ===');
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

// Check Android SDK environment variables
console.log('\nChecking Android SDK environment...');
const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (androidHome) {
  console.log('✓ ANDROID_HOME/ANDROID_SDK_ROOT is set to:', androidHome);
  
  // Check if the directory exists
  if (fs.existsSync(androidHome)) {
    console.log('✓ Android SDK directory exists');
  } else {
    console.log('✗ Android SDK directory does not exist at:', androidHome);
    console.log('  Please install Android SDK or correct the environment variable');
  }
} else {
  console.log('✗ ANDROID_HOME/ANDROID_SDK_ROOT environment variable is not set');
  console.log('  Please set it to your Android SDK location');
}

// Check Java version
console.log('\nChecking Java version...');
try {
  const javaVersion = execSync('java -version 2>&1').toString();
  console.log(javaVersion);
  
  if (javaVersion.includes('version "11') || javaVersion.includes('version "17')) {
    console.log('✓ Using compatible Java version (11 or 17)');
  } else {
    console.log('✗ Java version may not be compatible with React Native');
    console.log('  Recommended: Java 11 or 17');
  }
} catch (error) {
  console.log('✗ Java is not installed or not in PATH');
  console.log('  Please install JDK 11 or 17');
}

// Check for common Android build issues
console.log('\nChecking for common build issues...');

// Check build.gradle for correct configurations
const appBuildGradlePath = path.join(androidDir, 'app', 'build.gradle');
if (fs.existsSync(appBuildGradlePath)) {
  const appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');
  
  // Check compileSdkVersion
  const compileSdkMatch = appBuildGradle.match(/compileSdk(?:Version)?\s+(\d+)/);
  if (compileSdkMatch) {
    const compileSdkVersion = parseInt(compileSdkMatch[1]);
    console.log('compileSdkVersion:', compileSdkVersion);
    
    if (compileSdkVersion >= 33) {
      console.log('✓ compileSdkVersion is sufficient');
    } else {
      console.log('✗ compileSdkVersion is too low, should be at least 33');
    }
  }
  
  // Check for NDK issues
  if (appBuildGradle.includes('ndkVersion')) {
    const ndkMatch = appBuildGradle.match(/ndkVersion\s+["']([^"']+)["']/);
    if (ndkMatch) {
      console.log('ndkVersion:', ndkMatch[1]);
    }
  }
} else {
  console.log('✗ app/build.gradle file not found');
}

// Check for Metro bundler issues
console.log('\nChecking Metro bundler configuration...');
const metroConfigPath = path.join(qntmexWalletDir, 'metro.config.js');
if (fs.existsSync(metroConfigPath)) {
  console.log('✓ metro.config.js exists');
} else {
  console.log('✗ metro.config.js not found, may need to create it');
}

console.log('\n=== Recommended Actions ===');
console.log('1. Clean the project:');
console.log('   cd qntmex-wallet/android && .\\gradlew clean');
console.log('2. Clear Metro bundler cache:');
console.log('   npx react-native start --reset-cache');
console.log('3. Run with verbose logging:');
console.log('   cd qntmex-wallet && npx expo run:android --verbose');
console.log('4. Check for native module linking issues:');
console.log('   cd qntmex-wallet && npx react-native-asset');
console.log('\nIf problems persist, try:');
console.log('1. Reinstalling dependencies: npm ci');
console.log('2. Rebuilding the Android project: node setup-android.js');
console.log('3. Updating Expo SDK if you\'re using Expo');