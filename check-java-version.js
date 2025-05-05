/**
 * This script checks the Java version and provides guidance on switching between Java versions
 * Run with: node check-java-version.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== QNTMEX Wallet Java Version Checker ===');

// Function to safely execute a command and handle errors
function safeExecSync(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    return null;
  }
}

// Check Java version
console.log('\nChecking Java version...');
const javaVersionOutput = safeExecSync('java -version 2>&1');

if (!javaVersionOutput) {
  console.log('❌ Java is not installed or not in PATH');
  console.log('\nPlease install Java Development Kit (JDK) to continue.');
  console.log('Download from: https://adoptium.net/ or https://www.oracle.com/java/technologies/downloads/');
  process.exit(1);
}

// Parse Java version
const versionMatch = javaVersionOutput.match(/version "([\d._]+)"/i);
const implementationMatch = javaVersionOutput.match(/(?:Java\(TM\)|OpenJDK)\s+Runtime/i);

if (versionMatch) {
  const versionString = versionMatch[1];
  const majorVersion = versionString.split('.')[0];
  const numericVersion = parseInt(majorVersion, 10) || parseInt(versionString.split('.')[1], 10); // Handle both "11.x" and "1.8.x" formats
  
  console.log(`Detected Java version: ${versionString} (Java ${numericVersion})`);
  
  if (implementationMatch) {
    console.log(`Implementation: ${implementationMatch[0]}`);
  }
  
  // Check if version is compatible
  if (numericVersion === 17) {
    console.log('\n✅ You are using Java 17, which requires the Gradle fix for MaxPermSize.');
    console.log('Run the fix script: node fix-gradle-java17.js');
  } else if (numericVersion === 11) {
    console.log('\n✅ You are using Java 11, which is compatible with most Android builds.');
    console.log('You can proceed with: node run-with-gradle-fix.js');
  } else if (numericVersion === 8) {
    console.log('\n✅ You are using Java 8, which is compatible with older Android builds.');
    console.log('You can proceed with: node run-with-gradle-fix.js');
  } else if (numericVersion > 17) {
    console.log('\n⚠️ You are using a newer Java version which may not be fully compatible with the build tools.');
    console.log('Consider switching to Java 11 or 17 for better compatibility.');
  } else {
    console.log(`\n⚠️ Java ${numericVersion} may have compatibility issues with the build tools.`);
    console.log('Consider upgrading to Java 11 or 17 for better compatibility.');
  }
} else {
  console.log('\n⚠️ Could not determine Java version.');
}

// Check for multiple Java installations on Windows
console.log('\nChecking for multiple Java installations...');

if (process.platform === 'win32') {
  // Check Program Files directories
  const programDirs = [
    'C:\\Program Files\\Java',
    'C:\\Program Files (x86)\\Java',
    path.join(os.homedir(), '.jdks')
  ];
  
  let foundJavas = [];
  
  programDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const subdirs = fs.readdirSync(dir);
        subdirs.forEach(subdir => {
          const fullPath = path.join(dir, subdir);
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory() && (subdir.includes('jdk') || subdir.includes('jre'))) {
            // Try to determine version from directory name
            let version = 'unknown';
            const versionMatch = subdir.match(/(jdk|jre)[^\d]*(\d+)/);
            if (versionMatch) {
              version = versionMatch[2];
            }
            foundJavas.push({ path: fullPath, name: subdir, version });
          }
        });
      } catch (error) {
        // Ignore errors reading directories
      }
    }
  });
  
  if (foundJavas.length > 0) {
    console.log('Found Java installations:');
    foundJavas.forEach(java => {
      console.log(`- ${java.name} (Java ${java.version}) at ${java.path}`);
    });
    
    console.log('\nTo switch Java versions on Windows:');
    console.log('1. Open System Properties (Win+Pause or Control Panel > System > Advanced System Settings)');
    console.log('2. Click "Environment Variables"');
    console.log('3. Under System Variables, find and edit "Path"');
    console.log('4. Move the desired Java bin directory to the top of the list');
    console.log('5. Add or update JAVA_HOME variable to point to the JDK root directory');
    console.log('\nAlternatively, for temporary use in the current terminal:');
    console.log('set JAVA_HOME=C:\\path\\to\\your\\jdk');
    console.log('set PATH=%JAVA_HOME%\\bin;%PATH%');
  } else {
    console.log('No additional Java installations found in standard locations.');
  }
} else {
  // For non-Windows systems
  console.log('To check for multiple Java installations on this system:');
  console.log('- Run: update-alternatives --display java');
  console.log('- Or: ls -la /usr/lib/jvm/');
}

console.log('\nAfter ensuring you have the correct Java version:');
console.log('1. Run the Gradle fix script: node fix-gradle-java17.js');
console.log('2. Then run the Android app: node run-with-gradle-fix.js');