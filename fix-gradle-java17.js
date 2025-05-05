/**
 * This script fixes Gradle JVM arguments for Java 17 compatibility and cleans Gradle daemon
 * Run with: node fix-gradle-java17.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname);
const qntmexWalletDir = path.join(rootDir, 'qntmex-wallet');
const androidDir = path.join(qntmexWalletDir, 'android');

console.log('=== QNTMEX Wallet Gradle Java 17 Compatibility Fix ===');
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
console.log('\nFixing Gradle JVM arguments for Java 17 compatibility...');

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

// Add additional Gradle settings for better compatibility
if (!content.includes('org.gradle.daemon=true')) {
  content += '\n# Enable Gradle daemon for better performance\norg.gradle.daemon=true\n';
  modified = true;
  console.log('Enabled Gradle daemon for better performance');
}

if (!content.includes('org.gradle.parallel=true')) {
  content += '\n# Enable parallel project builds\norg.gradle.parallel=true\n';
  modified = true;
  console.log('Enabled parallel project builds');
}

// Write the updated content if modified
if (modified) {
  fs.writeFileSync(gradlePropertiesPath, content);
  console.log('Updated global Gradle properties file');
} else {
  console.log('Global Gradle properties file already optimized');
}

// Also check project-specific gradle.properties if it exists
const projectGradlePropsPath = path.join(androidDir, 'gradle.properties');
if (fs.existsSync(projectGradlePropsPath)) {
  console.log('\nChecking project gradle.properties...');
  let projectContent = fs.readFileSync(projectGradlePropsPath, 'utf8');
  
  // Check if it contains MaxPermSize
  let projectModified = false;
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
      projectModified = true;
      console.log('Removed MaxPermSize JVM argument from project gradle.properties!');
    }
  }
  
  // Add Android-specific optimizations if not present
  if (!projectContent.includes('android.useAndroidX=true')) {
    projectContent += '\n# Enable AndroidX\nandroid.useAndroidX=true\n';
    projectModified = true;
    console.log('Enabled AndroidX support');
  }
  
  if (projectModified) {
    fs.writeFileSync(projectGradlePropsPath, projectContent);
    console.log('Updated project Gradle properties file');
  } else {
    console.log('Project Gradle properties file already optimized');
  }
}

// Clean Gradle daemon directory to force creation of new daemons
console.log('\nCleaning Gradle daemon directory...');
const gradleDaemonDir = path.join(gradleDir, 'daemon');

if (fs.existsSync(gradleDaemonDir)) {
  try {
    console.log(`Removing Gradle daemon directory: ${gradleDaemonDir}`);
    fs.rmSync(gradleDaemonDir, { recursive: true, force: true });
    console.log('Successfully removed Gradle daemon directory');
  } catch (error) {
    console.error(`Error removing Gradle daemon directory: ${error.message}`);
    console.log('You may need to manually delete it or restart your computer');
  }
} else {
  console.log('Gradle daemon directory does not exist, no cleanup needed');
}

console.log('\n✅ Gradle configuration fixed for Java 17 compatibility!');
console.log('\nNext steps:');
console.log('1. If you still encounter issues, restart your computer to ensure all Gradle daemons are stopped');
console.log('2. Run the Android app with: node run-with-gradle-fix.js');
console.log('3. If problems persist, consider using Java 11 instead of Java 17');