# RN location demo

Inclusive ReactNative app that demonstrate using geolocation-service along with Huawei location kit (SDK), to get user's location on all mobile devices (IOS/Android-GMS/Android-HMS)
 

## Contents

  - [1. Introduction](#1-introduction)
  - [2. Installation](#2-installation)
  - [3. Gradle 7 support](#3-gradle7-support)
  - [4. Configuration](#4-configuration)
  - [5. Unlicensed](#5-unlicensed)

 

## 1. Introduction

This demo project is an example to demonstrate using Huawei location RN package along with RN geolocation Service, this app should be able to get user location on IOS, Android with `GMS` and Android with `HMS`.

`GMS` are Google mobile services which come pre-installed on majority of Android devices, except for Huawei, thats why attempting to get user location using react-native-geolocation-service on Huawei devices will not work, as it dependes on Google's `FusedLocationProviderClient` which is part of GMS.

`HMS` are Huawei mobile services which come pre-installed on Huawei devices, they are an alternative to `GMS` which provide similar or more services/SDKs called "kits". `HMS` provide its own fused location provided thats part of `Location kit`

The demo uses the `Platfom` class to determine if the device is IOS or Android, in case it's Android it uses [react-native-hms-availability](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-availability) to check if the Android device have `HMS` or not, if it's an `HMS` device the app will call [react-native-hms-location](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-location) APIs to get users location, otherwise it will invoke [react-native-geolocation-service](https://github.com/Agontuk/react-native-geolocation-service) APIs to get users location ( which uses Google FusedLocationProvider or IOS location provider).
  
**This demo has been tested on Android GMS and Android HMS, but NOT on IOS**
 
## 2. Installation

This app should work out of the box, just clone the repository then run these commands:

- install packages 

```bash
npm i 
```

- Run the app

```bash
npm run android
```

## 3. Gradle7 support

This project's Gradle version have been updated to version 7, which is not compatible with old gradle scripts from `@hmscore` libraries. Therefore patches have been included in `patches/` to fix gradle compilation errors cauzed mainly by unsupported `maven` plugin.
The patches will apply automatically everytime you install `node_modules`, aka after every `npm install`.


How to make your Gradle project compatible with `@hmscore` availability and location libraries:

1. install `patch-package` and `postinstall-postinstall` libraries using command: `npm i --save-dev patch-package postinstall-postinstall`
2. copy `@hmscore` patches from `patches/` to your projects root directory under folder named `patches/`, patch files are:
   1. `patches/@hmscore+react-native-hms-availability+5.2.0-300.patch`: patch file will fix the Gradle7 missing 'maven' plugin issue caused by availability libray
   2. `patches/@hmscore+react-native-hms-location+6.4.0-300.patch`: patch file will fix Gradle7 missing 'maven' plugin issue caused by location library
   3. `patches/@react-native-community+cli-platform-android+2.9.0.patch`: this patch file can be skipped, as it fixes the issue of old react-native cli and Gradle 7, that you most probably are not facing if you're using newer version of react-native
3. Add `postinstall` script to your `package.json` to automatically apply the patches:
```js
"scripts": {
 "postinstall": "patch-package"
 }
```


Done, run `npm i` to apply the patches, then run the app.
> Note: the above steps have already been applied to this project

## 4. Configuration

NO
 

## 5. Unlicensed

[The Unlicense](https://github.com/megaacheyounes/rn-geolocation-inclusive/blob/master/UNLICENSE) 
