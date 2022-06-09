# RN location demo

Inclusive ReactNative app that demonstrate using geolocation-service along with Huawei location kit (SDK), to get user's location on all mobile devices (IOS/Android-GMS/Android-HMS)

---

## Contents

  - [1. Introduction](#1-introduction)
  - [2. Installation](#2-installation)
  - [3. Configuration](#3-configuration)
  - [4. Unlicensed](#4-unlicensed)

---

## 1. Introduction

This demo project is an example to demonstrate using Huawei location RN package along with RN geolocation Service, this app should be able to get user location on IOS, Android with `GMS` and Android with `HMS`.

`GMS` are Google mobile services which come pre-installed on majority of Android devices, except for Huawei, thats why attempting to get user location using react-native-geolocation-service on Huawei devices will not work, as it dependes on Google's `FusedLocationProviderClient` which depend on GMS.

`HMS` are Huawei mobile services which come pre-installed on Huawei devices only, they are an alternative to GMS which provide similar or more services/SDK called "kits". `HMS` provide its own fused location provided thats part of `Location kit`

The demo uses the `Platfom` class to determine if the device is IOS or Android, in case it's Android it uses [react-native-hms-availability](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-availability) to check if the Android device have `HMS` or not, if it's an `HMS` device the app will call [react-native-hms-location](https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-location) APIs to get users location using location kit, otherwise it will invoke [react-native-geolocation-service](https://github.com/Agontuk/react-native-geolocation-service) APIs to get users location using Google FusedLocationProvider or IOS location provider.
  
*This demo has been tested on Android GMS and Android HMS, but NOT on IOS*

---

## 2. Installation

This app should work out of the box, just clone the repository then follow these very complex steps:

- install packages 

```bash
npm i 
```

- Run the app

```bash
npm run android
```

---

## 3. Configuration

Umm..NO

---

## 4. Unlicensed

This project is licensed under [The Unlicense](https://github.com/megaacheyounes/rn-geolocation-inclusive/blob/main/UNLICENSE) 
 

```
No Copyright (!c) 2022 Younes Megaache
All rights can be abused (respectfully)
```