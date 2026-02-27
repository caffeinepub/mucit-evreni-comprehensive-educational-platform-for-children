# Android WebView Setup Guide for Mucit Evreni

This guide explains how to convert the Mucit Evreni web app into an Android APK using Android Studio.

## Prerequisites

- Android Studio (latest version)
- Basic knowledge of Android development
- The web app running and accessible

## Step 1: Create Android Project

1. Open Android Studio
2. Create a new project with "Empty Activity"
3. Set the following:
   - Name: `Mucit Evreni`
   - Package name: `com.mucitevreni.app`
   - Language: Kotlin or Java
   - Minimum SDK: API 24 (Android 7.0)

## Step 2: Configure AndroidManifest.xml

Add the following permissions and configurations to your `AndroidManifest.xml`:

