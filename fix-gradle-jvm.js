/**
 * This script fixes the Gradle JVM arguments issue with MaxPermSize
 * Run with: node fix-gradle-jvm.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle JVM Fix ===');
console.log('Root directory:', rootDir);

// Possible locations for gradle.properties
const possibleLocations = [
  // Project-specific locations
  path.join(androidDir, 'gradle.properties'),
  path.join(qntmexWalletDir, 'gradle.properties'),
  // Global Gradle locations
  path.join(os.homedir(), '.gradle', 'gradle.properties')
];

let fixedAny = false;

// Function to fix MaxPermSize in a file
function fixGradleProperties(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  console.log(`\nChecking ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file contains MaxPermSize
  if (content.includes('MaxPermSize')) {
    console.log('Found MaxPermSize JVM argument!');
    
    // Create a backup
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content);
    console.log(`Created backup at: ${backupPath}`);
    
    // Remove MaxPermSize argument
    let updatedContent = content.replace(/-XX:MaxPermSize=\S+\s*/g, '');
    
    // If it's in org.gradle.jvmargs, fix it
    updatedContent = updatedContent.replace(/org\.gradle\.jvmargs=(.*)MaxPermSize=\S+(.*)/g, 'org.gradle.jvmargs=$1$2');
    
    // Clean up any double spaces
    updatedContent = updatedContent.replace(/\s{2,}/g, ' ');
    
    // Write the updated content
    fs.writeFileSync(filePath, updatedContent);
    console.log('Removed MaxPermSize JVM argument!');
    return true;
  } else {
    console.log('No MaxPermSize JVM argument found in this file.');
    return false;
  }
}

// Check all possible locations
console.log('\nSearching for gradle.properties files...');
for (const location of possibleLocations) {
  if (fixGradleProperties(location)) {
    fixedAny = true;
  }
}

// Check for gradle.properties in .gradle subdirectories
const gradleDir = path.join(os.homedir(), '.gradle');
if (fs.existsSync(gradleDir)) {
  try {
    const subdirs = fs.readdirSync(gradleDir);
    for (const subdir of subdirs) {
      const subdirPath = path.join(gradleDir, subdir);
      if (fs.statSync(subdirPath).isDirectory()) {
        const gradlePropsPath = path.join(subdirPath, 'gradle.properties');
        if (fixGradleProperties(gradlePropsPath)) {
          fixedAny = true;
        }
      }
    }
  } catch (error) {
    console.error('Error reading .gradle directory:', error.message);
  }
}

// Check for daemon.properties files which might also contain JVM args
const daemonDir = path.join(os.homedir(), '.gradle', 'daemon');
if (fs.existsSync(daemonDir)) {
  try {
    console.log('\nChecking daemon properties files...');
    const findDaemonProps = (dir) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const entryPath = path.join(dir, entry);
        if (fs.statSync(entryPath).isDirectory()) {
          findDaemonProps(entryPath);
        } else if (entry === 'daemon.properties.txt') {
          if (fixGradleProperties(entryPath)) {
            fixedAny = true;
          }
        }
      }
    };
    findDaemonProps(daemonDir);
  } catch (error) {
    console.error('Error reading daemon directory:', error.message);
  }
}

if (fixedAny) {
  console.log('\n✅ Fixed Gradle JVM arguments issue!');
  console.log('\nPlease try running your app again with:');
  console.log('node run-android.js');
} else {
  console.log('\n⚠️ Could not find any gradle.properties files with MaxPermSize argument.');
  console.log('\nManual fix:');
  console.log('1. Look for any gradle.properties files in your system');
  console.log('2. Open them in a text editor');
  console.log('3. Remove any -XX:MaxPermSize=1024m arguments');
  console.log('4. Save the files and try running your app again');
}

console.log('\nNote: The MaxPermSize JVM argument is not supported in Java 17.');
console.log('If you continue to have issues, consider using Java 11 instead of Java 17.');