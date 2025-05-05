# Gradle Version Mismatch Fix

## Problem

The project is configured to use Gradle 7.5.1 in the root `gradle-wrapper.properties` file, but the build process is downloading Gradle 8.3 instead. This happens because there are two different `gradle-wrapper.properties` files in the project:

1. Root project file: `c:\Users\USER\Desktop\vid\qntmex Wallet\android\gradle\wrapper\gradle-wrapper.properties` (using 7.5.1)
2. qntmex-wallet project file: `c:\Users\USER\Desktop\vid\qntmex Wallet\qntmex-wallet\android\gradle\wrapper\gradle-wrapper.properties` (was using 8.3)

## Solution

The solution is to ensure both files use the same Gradle version. We've updated the qntmex-wallet project's `gradle-wrapper.properties` file to use Gradle 7.5.1 instead of 8.3.

## Additional Steps

If you're still experiencing issues with Gradle downloading the wrong version, follow these steps:

1. Clean the Gradle cache to force re-downloading the correct version:
   ```
   node clean-gradle-cache.js
   ```

2. If the script doesn't work, manually delete these directories:
   - Windows: `%USERPROFILE%\.gradle\caches`
   - Windows: `%USERPROFILE%\.gradle\wrapper\dists\gradle-8.3-all`

3. Run the app with the Gradle fix script:
   ```
   node run-with-gradle-fix.js
   ```

## Technical Details

Gradle uses the `gradle-wrapper.properties` file to determine which version to download and use. When there are multiple wrapper files in a project hierarchy, the one closest to the execution context is used.

The MaxPermSize JVM argument issue mentioned in the scripts is related to Java 17 compatibility. The `-XX:MaxPermSize` argument was removed in Java 8, so it causes errors when using Java 17. The fix scripts also address this issue by removing this argument from Gradle configuration files.

## Files Modified

- `c:\Users\USER\Desktop\vid\qntmex Wallet\qntmex-wallet\android\gradle\wrapper\gradle-wrapper.properties`
  - Changed `distributionUrl` from `gradle-8.3-all.zip` to `gradle-7.5.1-all.zip`

## Scripts Created

1. `fix-gradle-version.js` - Updates the Gradle version in wrapper properties files
2. `clean-gradle-cache.js` - Cleans the Gradle cache to ensure the correct version is used