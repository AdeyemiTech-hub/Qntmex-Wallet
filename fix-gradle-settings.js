/**
 * This script fixes common Gradle settings issues in the Android project
 * Run with: node fix-gradle-settings.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle Settings Fixer ===');
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
  process.exit(1);
}

// Fix settings.gradle file
const settingsGradlePath = path.join(androidDir, 'settings.gradle');
if (fs.existsSync(settingsGradlePath)) {
  console.log('\nFixing settings.gradle file...');
  
  try {
    let settingsContent = fs.readFileSync(settingsGradlePath, 'utf8');
    
    // Add repositories block if it doesn't exist
    if (!settingsContent.includes('repositories {')) {
      const repositoriesBlock = `\n// Add repositories block for React Native
repositories {\n    google()\n    mavenCentral()\n    maven { url "https://www.jitpack.io" }\n}\n`;
      
      // Add after pluginManagement if it exists, otherwise add at the beginning
      if (settingsContent.includes('pluginManagement {')) {
        settingsContent = settingsContent.replace('pluginManagement {', 'pluginManagement {' + repositoriesBlock);
      } else {
        settingsContent = repositoriesBlock + settingsContent;
      }
      
      fs.writeFileSync(settingsGradlePath, settingsContent, 'utf8');
      console.log('✓ Added repositories block to settings.gradle');
    } else {
      console.log('✓ settings.gradle already has repositories block');
    }
  } catch (error) {
    console.error('Error fixing settings.gradle:', error.message);
  }
} else {
  console.log('\nWARNING: settings.gradle file is missing!');
  console.log('Please run the setup script first: node setup-android.js');
}

console.log('\nGradle settings fix complete. Now try running the app with:');
console.log('node run-android.js');