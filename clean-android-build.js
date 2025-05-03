/**
 * This script cleans the Android build environment and Gradle cache
 * Run with: node clean-android-build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Android Build Cleaner ===');
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

console.log('\nCleaning Android build environment...');

try {
  // Change to the Android directory
  process.chdir(androidDir);
  console.log('Changed directory to:', process.cwd());
  
  // Run Gradle clean
  console.log('\nRunning: gradlew clean');
  execSync('.\\gradlew clean', { stdio: 'inherit' });
  
  // Clean build directories manually
  console.log('\nCleaning build directories...');
  const buildDirs = [
    path.join(androidDir, 'app', 'build'),
    path.join(androidDir, 'build')
  ];
  
  buildDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Removing: ${dir}`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  
  // Clean Gradle cache
  console.log('\nCleaning Gradle cache...');
  const userHome = process.env.USERPROFILE || process.env.HOME;
  const gradleCacheDir = path.join(userHome, '.gradle', 'caches');
  
  if (fs.existsSync(gradleCacheDir)) {
    console.log(`Note: To completely clean Gradle cache, you may want to manually delete: ${gradleCacheDir}`);
  }
  
  // Return to root directory
  process.chdir(rootDir);
  
  console.log('\n✓ Android build environment cleaned successfully!');
  console.log('\nNext steps:');
  console.log('1. Run the troubleshooting script: node troubleshoot-android.js');
  console.log('2. Try building the app again: node run-android.js');
  
} catch (error) {
  console.error('\nError cleaning Android build:', error.message);
  console.log('\nTry manually cleaning:');
  console.log(`1. Delete the build folders in: ${androidDir}\\app\\build and ${androidDir}\\build`);
  console.log('2. Run Gradle clean manually: cd qntmex-wallet/android && .\\gradlew clean');
}