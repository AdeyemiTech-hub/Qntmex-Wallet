# QNTMEX Wallet Android Setup Guide

This guide will help you fix the Gradle build error and run the QNTMEX Wallet Android app successfully.

## The Problem

You're encountering a Gradle build error related to the `repositories()` method in the `native_modules.gradle` file. The error occurs because the repositories block is being used in a settings script context where it's not available.

```
Could not find method repositories() for arguments [...] on settings 'qntmexwallet' of type org.gradle.initialization.DefaultSettings.
```

## Solution

We've created several scripts to fix this issue and simplify running the Android app:

### 1. Fix the Gradle Settings

Run the following command to fix the Gradle settings issue:

```bash
node fix-gradle-settings.js
```

This script will:
- Check if the Android directory exists
- Add the correct repositories block to the settings.gradle file

### 2. Run the Android App

After fixing the Gradle settings, run the app using:

```bash
node run-android.js
```

This script will:
- Automatically change to the qntmex-wallet directory
- Run the correct command: `npx expo run:android`
- Display any errors with troubleshooting steps

## Troubleshooting

If you still encounter issues:

1. Make sure you have Android Studio installed and configured
2. Ensure you have an Android device connected or emulator running
3. Try running the setup script again: `node setup-android.js`
4. Check if your Android SDK is properly configured

## Project Structure

The project consists of two main parts:

1. The root project (`qntmex Wallet`) - Contains setup scripts and configuration
2. The actual app (`qntmex-wallet`) - Contains the React Native/Expo app code

The Android-specific code is located in the `qntmex-wallet/android` directory.

## Commands Reference

- `node setup-android.js` - Initialize the Android project structure
- `node verify-android-setup.js` - Verify the Android setup
- `node fix-gradle-settings.js` - Fix Gradle settings issues
- `node run-android.js` - Run the Android app