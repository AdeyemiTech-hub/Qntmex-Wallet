/**
 * This script fixes the Gradle daemon JVM arguments issue with MaxPermSize
 * Run with: node fix-gradle-daemon.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== QNTMEX Wallet Gradle Daemon Fix ===');

// Path to the Gradle daemon configuration directory
const gradleDir = path.join(os.homedir(), '.gradle');
const gradlePropertiesPath = path.join(gradleDir, 'gradle.properties');

console.log('Checking global Gradle properties at:', gradlePropertiesPath);

// Create a new gradle.properties file if it doesn't exist
if (!fs.existsSync(gradlePropertiesPath)) {
  console.log('Creating new gradle.properties file...');
  const defaultContent = '# Gradle properties\n# Modified by QNTMEX Wallet fix script\n';
  fs.mkdirSync(path.dirname(gradlePropertiesPath), { recursive: true });
  fs.writeFileSync(gradlePropertiesPath, defaultContent);
}

// Read the current content
let content = fs.readFileSync(gradlePropertiesPath, 'utf8');

// Create a backup
const backupPath = `${gradlePropertiesPath}.backup`;
fs.writeFileSync(backupPath, content);
console.log(`Created backup at: ${backupPath}`);

// Check if the file contains org.gradle.jvmargs
if (content.includes('org.gradle.jvmargs')) {
  // Remove MaxPermSize argument if it exists
  content = content.replace(/-XX:MaxPermSize=\S+\s*/g, '');
  content = content.replace(/org\.gradle\.jvmargs=(.*)MaxPermSize=\S+(.*)/g, 'org.gradle.jvmargs=$1$2');
  
  // Clean up any double spaces
  content = content.replace(/\s{2,}/g, ' ');
  
  console.log('Updated existing JVM arguments to remove MaxPermSize');
} else {
  // Add new JVM args without MaxPermSize
  content += '\n# JVM arguments optimized for Java 17\norg.gradle.jvmargs=-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8\n';
  console.log('Added new JVM arguments optimized for Java 17');
}

// Write the updated content
fs.writeFileSync(gradlePropertiesPath, content);

console.log('\n✅ Fixed Gradle daemon configuration!');
console.log('\nPlease try running your app again with:');
console.log('node run-android.js');

console.log('\nNote: The MaxPermSize JVM argument is not supported in Java 17.');
console.log('If you continue to have issues, you may need to:');
console.log('1. Delete the .gradle/daemon directory to force creation of a new daemon');
console.log('2. Restart your computer to ensure all Gradle daemons are stopped');
console.log('3. Consider using Java 11 instead of Java 17 if problems persist');