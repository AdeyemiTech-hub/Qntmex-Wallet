/**
 * This script cleans the Gradle cache to ensure the correct version is used
 * Run with: node clean-gradle-cache.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle Cache Cleaner ===');
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

// Verify the gradle-wrapper.properties file is using the correct version
const gradleWrapperPath = path.join(androidDir, 'gradle', 'wrapper', 'gradle-wrapper.properties');
if (fs.existsSync(gradleWrapperPath)) {
  console.log('\nChecking gradle-wrapper.properties...');
  const gradleWrapperContent = fs.readFileSync(gradleWrapperPath, 'utf8');
  
  if (gradleWrapperContent.includes('gradle-7.5.1-all.zip') || gradleWrapperContent.includes('gradle-7.6-all.zip')) {
    console.log('✓ Using compatible Gradle version as configured');
  } else {
    console.error('✗ gradle-wrapper.properties is not using a compatible Gradle version!');
    console.log('Please run the fix-gradle-version.js script first.');
    process.exit(1);
  }
}

// Clean Gradle caches
console.log('\nCleaning Gradle caches...');

// Path to the Gradle caches directory
const gradleCachesDir = path.join(os.homedir(), '.gradle', 'caches');
const gradleWrappersDir = path.join(os.homedir(), '.gradle', 'wrapper', 'dists');

// Check if the directories exist before attempting to delete
if (fs.existsSync(gradleCachesDir)) {
  try {
    console.log(`Removing Gradle caches directory: ${gradleCachesDir}`);
    // On Windows, we need to use the appropriate command to delete directories
    execSync(`rmdir /s /q "${gradleCachesDir}"`, { stdio: 'inherit' });
    console.log('✓ Gradle caches directory removed successfully');
  } catch (error) {
    console.error('Error removing Gradle caches directory:', error.message);
    console.log('\nYou may need to manually delete the directory:');
    console.log(`rmdir /s /q "${gradleCachesDir}"`);
  }
} else {
  console.log('Gradle caches directory does not exist, nothing to clean');
}

// Clean any incompatible Gradle wrappers if they exist
const incompatibleGradleDirs = [
  path.join(gradleWrappersDir, 'gradle-8.3-all'),
  // Add other incompatible Gradle versions here if needed
];

// Loop through and clean each incompatible Gradle wrapper directory
incompatibleGradleDirs.forEach(gradleDir => {
  if (fs.existsSync(gradleDir)) {
    try {
      console.log(`\nRemoving incompatible Gradle wrapper directory: ${gradleDir}`);
      execSync(`rmdir /s /q "${gradleDir}"`, { stdio: 'inherit' });
      console.log(`✓ ${path.basename(gradleDir)} wrapper directory removed successfully`);
    } catch (error) {
      console.error(`Error removing ${path.basename(gradleDir)} wrapper directory:`, error.message);
      console.log('\nYou may need to manually delete the directory:');
      console.log(`rmdir /s /q "${gradleDir}"`);
    }
  }
});


console.log('\n✅ Gradle cache cleaning complete!');
console.log('\nNext steps:');
console.log('1. Try running your app again with:');
console.log('   node run-with-gradle-fix.js');
console.log('\nThis should now use Gradle 7.6 instead of downloading Gradle 8.3');