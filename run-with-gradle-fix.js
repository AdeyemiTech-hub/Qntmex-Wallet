/**
 * This script fixes the Gradle JVM arguments issue and runs the Android app
 * Run with: node run-with-gradle-fix.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Android Runner with Gradle Fix ===');
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

// Fix Gradle JVM arguments issue
console.log('\nFixing Gradle JVM arguments issue...');

// Path to the global Gradle properties file
const gradleDir = path.join(os.homedir(), '.gradle');
const gradlePropertiesPath = path.join(gradleDir, 'gradle.properties');

// Create a new gradle.properties file if it doesn't exist
if (!fs.existsSync(gradlePropertiesPath)) {
  console.log('Creating new gradle.properties file...');
  const defaultContent = '# Gradle properties\n# Created by QNTMEX Wallet fix script\n';
  fs.mkdirSync(path.dirname(gradlePropertiesPath), { recursive: true });
  fs.writeFileSync(gradlePropertiesPath, defaultContent);
}

// Read the current content
let content = fs.readFileSync(gradlePropertiesPath, 'utf8');

// Create a backup if not already done
const backupPath = `${gradlePropertiesPath}.backup`;
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content);
  console.log(`Created backup at: ${backupPath}`);
}

// Check if the file contains org.gradle.jvmargs
let modified = false;
if (content.includes('org.gradle.jvmargs')) {
  // Check if it contains MaxPermSize
  if (content.includes('MaxPermSize')) {
    // Remove MaxPermSize argument
    const oldContent = content;
    content = content.replace(/-XX:MaxPermSize=\S+\s*/g, '');
    content = content.replace(/org\.gradle\.jvmargs=(.*)MaxPermSize=\S+(.*)/g, 'org.gradle.jvmargs=$1$2');
    
    // Clean up any double spaces
    content = content.replace(/\s{2,}/g, ' ');
    
    if (content !== oldContent) {
      modified = true;
      console.log('Removed MaxPermSize JVM argument!');
    }
  }
} else {
  // Add new JVM args without MaxPermSize
  content += '\n# JVM arguments optimized for Java 17\norg.gradle.jvmargs=-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8\n';
  modified = true;
  console.log('Added new JVM arguments optimized for Java 17');
}

// Write the updated content if modified
if (modified) {
  fs.writeFileSync(gradlePropertiesPath, content);
  console.log('Updated Gradle properties file');
} else {
  console.log('Gradle properties file already optimized');
}

// Also check project-specific gradle.properties if it exists
const projectGradlePropsPath = path.join(androidDir, 'gradle.properties');
if (fs.existsSync(projectGradlePropsPath)) {
  console.log('\nChecking project gradle.properties...');
  let projectContent = fs.readFileSync(projectGradlePropsPath, 'utf8');
  
  // Check if it contains MaxPermSize
  if (projectContent.includes('MaxPermSize')) {
    // Create a backup
    const projectBackupPath = `${projectGradlePropsPath}.backup`;
    if (!fs.existsSync(projectBackupPath)) {
      fs.writeFileSync(projectBackupPath, projectContent);
      console.log(`Created backup at: ${projectBackupPath}`);
    }
    
    // Remove MaxPermSize argument
    const oldContent = projectContent;
    projectContent = projectContent.replace(/-XX:MaxPermSize=\S+\s*/g, '');
    projectContent = projectContent.replace(/org\.gradle\.jvmargs=(.*)MaxPermSize=\S+(.*)/g, 'org.gradle.jvmargs=$1$2');
    
    // Clean up any double spaces
    projectContent = projectContent.replace(/\s{2,}/g, ' ');
    
    if (projectContent !== oldContent) {
      fs.writeFileSync(projectGradlePropsPath, projectContent);
      console.log('Removed MaxPermSize JVM argument from project gradle.properties!');
    }
  }
}

console.log('\n✅ Gradle configuration fixed!');

try {
  // Change to the qntmex-wallet directory
  process.chdir(qntmexWalletDir);
  console.log('\nChanged directory to:', process.cwd());
  
  // Run the command to start the Android app
  console.log('\nStarting Android app...');
  console.log('This may take a few minutes. Please be patient.');
  
  // Use the correct command for running the Android app
  execSync('npx expo run:android', { stdio: 'inherit' });
  
} catch (error) {
  console.error('\nError running Android app:', error.message);
  
  if (error.message.includes('MaxPermSize')) {
    console.log('\nThe MaxPermSize error is still occurring. Try these additional steps:');
    console.log('1. Delete the .gradle/daemon directory to force creation of a new daemon:');
    console.log(`   rm -rf "${path.join(os.homedir(), '.gradle', 'daemon')}"`);
    console.log('2. Restart your computer to ensure all Gradle daemons are stopped');
    console.log('3. Try using Java 11 instead of Java 17 if problems persist');
  } else {
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure you have Android Studio installed and configured');
    console.log('2. Ensure you have an Android device connected or emulator running');
    console.log('3. Try running the setup script again: node setup-android.js');
    console.log('4. Check if your Android SDK is properly configured: node check-android-sdk.js');
  }
}