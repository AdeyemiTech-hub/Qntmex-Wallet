/**
 * This script checks Android SDK configuration and provides guidance
 * Run with: node check-android-sdk.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Android SDK Checker ===');
console.log('Root directory:', rootDir);

// Check if qntmex-wallet directory exists
if (!fs.existsSync(qntmexWalletDir)) {
  console.error('ERROR: qntmex-wallet directory does not exist!');
  process.exit(1);
}

// Check Android SDK environment variables
console.log('\nChecking Android SDK environment variables...');
const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;

if (androidHome) {
  console.log('✓ ANDROID_HOME/ANDROID_SDK_ROOT is set to:', androidHome);
  
  // Check if the directory exists
  if (fs.existsSync(androidHome)) {
    console.log('✓ Android SDK directory exists');
    
    // Check for essential SDK components
    const platformsDir = path.join(androidHome, 'platforms');
    const buildToolsDir = path.join(androidHome, 'build-tools');
    const cmdlineToolsDir = path.join(androidHome, 'cmdline-tools');
    
    if (fs.existsSync(platformsDir)) {
      console.log('✓ Android SDK Platforms directory exists');
      // List available platform versions
      try {
        const platforms = fs.readdirSync(platformsDir);
        console.log('  Available Android platforms:', platforms.join(', '));
      } catch (error) {
        console.log('  Could not read platforms directory');
      }
    } else {
      console.log('✗ Android SDK Platforms directory not found');
      console.log('  Run Android Studio SDK Manager and install Android SDK Platform');
    }
    
    if (fs.existsSync(buildToolsDir)) {
      console.log('✓ Android SDK Build Tools directory exists');
      // List available build tools versions
      try {
        const buildTools = fs.readdirSync(buildToolsDir);
        console.log('  Available Build Tools versions:', buildTools.join(', '));
      } catch (error) {
        console.log('  Could not read build-tools directory');
      }
    } else {
      console.log('✗ Android SDK Build Tools directory not found');
      console.log('  Run Android Studio SDK Manager and install Android SDK Build Tools');
    }
    
    if (fs.existsSync(cmdlineToolsDir)) {
      console.log('✓ Android SDK Command-line Tools directory exists');
    } else {
      console.log('✗ Android SDK Command-line Tools directory not found');
      console.log('  Run Android Studio SDK Manager and install Android SDK Command-line Tools');
    }
  } else {
    console.log('✗ Android SDK directory does not exist at:', androidHome);
    console.log('  Please install Android SDK or correct the environment variable');
  }
} else {
  console.log('✗ ANDROID_HOME/ANDROID_SDK_ROOT environment variable is not set');
  console.log('  Please set it to your Android SDK location');
  
  // Suggest possible locations
  const userHome = os.homedir();
  const possibleLocations = [
    path.join(userHome, 'AppData', 'Local', 'Android', 'Sdk'),
    path.join(userHome, 'Android', 'Sdk'),
    path.join('C:', 'Android', 'Sdk')
  ];
  
  console.log('\nPossible Android SDK locations to check:');
  possibleLocations.forEach(location => {
    if (fs.existsSync(location)) {
      console.log(`  - ${location} (EXISTS)`); 
      console.log('    Set ANDROID_HOME to this location in your environment variables');
    } else {
      console.log(`  - ${location} (not found)`);
    }
  });
}

// Check local.properties file
const localPropertiesPath = path.join(androidDir, 'local.properties');
console.log('\nChecking local.properties file...');

if (fs.existsSync(localPropertiesPath)) {
  console.log('✓ local.properties file exists');
  const localPropertiesContent = fs.readFileSync(localPropertiesPath, 'utf8');
  
  // Check for sdk.dir property
  const sdkDirMatch = localPropertiesContent.match(/sdk\.dir=(.+)/);
  if (sdkDirMatch) {
    const sdkDir = sdkDirMatch[1].replace(/\\/g, '\\\\');
    console.log('  SDK directory in local.properties:', sdkDir);
    
    if (fs.existsSync(sdkDir)) {
      console.log('✓ SDK directory in local.properties exists');
    } else {
      console.log('✗ SDK directory in local.properties does not exist');
      console.log('  Update local.properties with the correct SDK path');
    }
  } else {
    console.log('✗ sdk.dir property not found in local.properties');
    console.log('  Add sdk.dir=<path-to-your-android-sdk> to local.properties');
  }
} else {
  console.log('✗ local.properties file not found');
  console.log('  Create a local.properties file in the android directory with:');
  console.log(`  sdk.dir=${androidHome ? androidHome.replace(/\\/g, '\\\\') : '<path-to-your-android-sdk>'}`);
}

console.log('\n=== Recommended Actions ===');
console.log('1. Make sure Android SDK is properly installed');
console.log('2. Set ANDROID_HOME environment variable to your Android SDK location');
console.log('3. Install required SDK components using Android Studio SDK Manager:');
console.log('   - Android SDK Platform (API level 33 or higher)');
console.log('   - Android SDK Build-Tools (latest version)');
console.log('   - Android SDK Command-line Tools');
console.log('   - Android SDK Platform-Tools');
console.log('4. Create or update local.properties in the android directory');
console.log('\nAfter fixing SDK issues, try running the app again:');
console.log('node run-android.js');