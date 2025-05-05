/**
 * This script fixes the Gradle version mismatch issue
 * Run with: node fix-gradle-version.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle Version Fixer ===');
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

// Fix gradle-wrapper.properties in the qntmex-wallet project
const projectGradleWrapperPath = path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.properties');
if (fs.existsSync(projectGradleWrapperPath)) {
  console.log('\nFixing gradle-wrapper.properties in the qntmex-wallet project...');
  
  try {
    let content = fs.readFileSync(projectGradleWrapperPath, 'utf8');
    
    // Create a backup
    const backupPath = `${projectGradleWrapperPath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup at: ${backupPath}`);
    }
    
    // Check if it's using Gradle 8.3
    if (content.includes('gradle-8.3-all.zip')) {
      // Update to Gradle 7.6
      content = content.replace(
        /distributionUrl=.*\/gradle-8\.3-all\.zip/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip'
      );
      
      fs.writeFileSync(projectGradleWrapperPath, content);
      console.log('✅ Updated Gradle version from 8.3 to 7.6');
    } else if (content.includes('gradle-7.6-all.zip')) {
      console.log('✓ Already using Gradle 7.6');
    } else if (content.includes('gradle-7.5.1-all.zip')) {
      // Update to Gradle 7.6
      content = content.replace(
        /distributionUrl=.*\/gradle-7\.5\.1-all\.zip/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip'
      );
      
      fs.writeFileSync(projectGradleWrapperPath, content);
      console.log('✅ Updated Gradle version from 7.5.1 to 7.6');
    } else {
      const gradleVersionMatch = content.match(/distributionUrl=.*\/gradle-(\d+\.\d+(?:\.\d+)?)-all\.zip/);
      if (gradleVersionMatch) {
        const currentVersion = gradleVersionMatch[1];
        console.log(`Current Gradle version: ${currentVersion}`);
        
        // Update to Gradle 7.6
        content = content.replace(
          /distributionUrl=.*\/gradle-.*-all\.zip/,
          'distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip'
        );
        
        fs.writeFileSync(projectGradleWrapperPath, content);
        console.log(`✅ Updated Gradle version from ${currentVersion} to 7.6`);
      }
    }
  } catch (error) {
    console.error('Error updating gradle-wrapper.properties:', error.message);
  }
} else {
  console.log('\nWARNING: gradle-wrapper.properties file is missing in the qntmex-wallet project!');
}

// Also check the root gradle-wrapper.properties if it exists
const rootGradleWrapperPath = path.join(rootDir, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');
if (fs.existsSync(rootGradleWrapperPath)) {
  console.log('\nFixing gradle-wrapper.properties in the root project...');
  
  try {
    let content = fs.readFileSync(rootGradleWrapperPath, 'utf8');
    
    // Create a backup
    const backupPath = `${rootGradleWrapperPath}.backup`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup at: ${backupPath}`);
    }
    
    // Check if it's using a different Gradle version
    if (!content.includes('gradle-7.6-all.zip')) {
      // Update to Gradle 7.6
      content = content.replace(
        /distributionUrl=.*\/gradle-.*-all\.zip/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-7.6-all.zip'
      );
      
      fs.writeFileSync(rootGradleWrapperPath, content);
      console.log('✅ Updated Gradle version to 7.6 in root project');
    } else {
      console.log('✓ Root project already using Gradle 7.6');
    }
  } catch (error) {
    console.error('Error updating root gradle-wrapper.properties:', error.message);
  }
}

console.log('\n✅ Gradle version fix complete!');
console.log('\nNext steps:');
console.log('1. Delete the .gradle/caches directory to force re-download of the correct Gradle version:');
console.log(`   rm -rf "${path.join(require('os').homedir(), '.gradle', 'caches')}"`);
console.log('2. Try running your app again with:');
console.log('   node run-with-gradle-fix.js');