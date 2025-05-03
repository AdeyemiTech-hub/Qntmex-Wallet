/**
 * This script helps check and troubleshoot Gradle configuration issues
 * Run with: node check-gradle.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle Configuration Checker ===');
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

// Check react-native.config.js
const rnConfigPath = path.join(rootDir, 'react-native.config.js');
if (fs.existsSync(rnConfigPath)) {
  console.log('\nChecking react-native.config.js...');
  const rnConfig = require(rnConfigPath);
  console.log('Android sourceDir:', rnConfig.project?.android?.sourceDir);
  
  if (rnConfig.project?.android?.sourceDir === './qntmex-wallet/android') {
    console.log('✓ react-native.config.js is correctly configured');
  } else {
    console.log('✗ react-native.config.js needs to be updated to point to ./qntmex-wallet/android');
  }
}

// Check gradle-wrapper.properties
const gradleWrapperPath = path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.properties');
if (fs.existsSync(gradleWrapperPath)) {
  console.log('\nChecking gradle-wrapper.properties...');
  const gradleWrapperContent = fs.readFileSync(gradleWrapperPath, 'utf8');
  
  // Extract Gradle version and network timeout
  const gradleVersionMatch = gradleWrapperContent.match(/distributionUrl=.*\/gradle-(\d+\.\d+(?:\.\d+)?)-all\.zip/);
  const networkTimeoutMatch = gradleWrapperContent.match(/networkTimeout=(\d+)/);
  
  if (gradleVersionMatch) {
    const gradleVersion = gradleVersionMatch[1];
    console.log('Gradle version:', gradleVersion);
    
    // Check if Gradle version is compatible with React Native
    if (gradleVersion === '8.3') {
      console.log('✓ Using compatible Gradle version 8.3');
    } else {
      console.log(`✗ Gradle version ${gradleVersion} may not be compatible with React Native. Consider using 8.3`);
    }
  }
  
  if (networkTimeoutMatch) {
    const networkTimeout = parseInt(networkTimeoutMatch[1]);
    console.log('Network timeout:', networkTimeout, 'ms');
    
    if (networkTimeout >= 60000) {
      console.log('✓ Network timeout is sufficient');
    } else {
      console.log('✗ Network timeout is too low. Consider increasing to at least 60000 ms');
    }
  }
}

// Check gradle.properties
const gradlePropertiesPath = path.join(androidDir, 'gradle.properties');
if (fs.existsSync(gradlePropertiesPath)) {
  console.log('\nChecking gradle.properties...');
  const gradlePropertiesContent = fs.readFileSync(gradlePropertiesPath, 'utf8');
  
  // Check for connection timeout settings
  if (gradlePropertiesContent.includes('org.gradle.internal.http.connectionTimeout=')) {
    console.log('✓ Connection timeout is configured');
  } else {
    console.log('✗ Connection timeout is not configured');
  }
  
  // Check for socket timeout settings
  if (gradlePropertiesContent.includes('org.gradle.internal.http.socketTimeout=')) {
    console.log('✓ Socket timeout is configured');
  } else {
    console.log('✗ Socket timeout is not configured');
  }
  
  // Check for Gradle daemon
  if (gradlePropertiesContent.includes('org.gradle.daemon=true')) {
    console.log('✓ Gradle daemon is enabled');
  } else {
    console.log('✗ Gradle daemon is not enabled');
  }
}

console.log('\nConfiguration check complete.');
console.log('\nTroubleshooting tips:');
console.log('1. If you\'re still experiencing Gradle download issues, check your internet connection');
console.log('2. Try using a VPN if your network blocks Gradle downloads');
console.log('3. You can manually download the Gradle distribution and place it in the Gradle cache');
console.log('4. Make sure your Android SDK is properly installed and configured');