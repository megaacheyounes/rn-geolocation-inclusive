/**
 * location provider on huawei android devices
 */
import HmsLocationProvider from "./HmsLocationProvider";

/**
 * location provider on ios and nonhuawei android devices
 */
// import GeneralLocationProvider from "./GeneralLocationProvider";

import Geolocation from "react-native-geolocation-service";

import HMSAvailability, {
  ErrorCode,
} from "@hmscore/react-native-hms-availability";

import { transformHuaweiLocation } from "./LocationUtils";

const HMS_LOCATION_REQ_CODE = 1;

const geoWatchOptions = {
  accuracy: {
    android: "high",
    ios: "best",
  },
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
  distanceFilter: 0,
  forceRequestLocation: true,
  forceLocationManager: false,
  showLocationDialog: true,
};

/**
 *
 * this variable points to the acutal callback function passed to {@link LocationManager.getLocationUpdates}
 * this function is invoked in {@link LocationManager.locationUpdateCallbackWrapper} whenever the app recieve a new location update
 * is it only used when the enviroment running the app is HMS , measn an android device with HMS (huawei mobiel services)
 * as the wrapper function have to transform the location result object recived by Huawie locatoin SDK to match the data structure of the object returhned by he geolocation-services package
 */
var locationUpdateCallback;

/**
 * this class has location implemntation for IOS + Android-Google + Android-Huawei
 * it uses react-native-hms-location to get location on huawei Android devices
 * and react-native-geolocation-service package to get location on IOS and non huawei Android devices
 *
 * this class includes only a few APIs provide by hms-location package, to learn more follow this link:
 * {@link https://github.com/HMS-Core/hms-react-native-plugin/tree/master/react-native-hms-location}
 *
 *
 */
const LocationManager = {
  /**
   * variable that will be set to true or false once we call hms availability package
   * initialized in {@link LocationManager.isHmsDevice}
   * used to avoid calling the HMS availability API everytime, AKA, cache
   *
   * @type boolean
   */
  _isHmsDevice: undefined,
  /**
   * check whether the current device is an Android devices with HMS (Huawei mobile services) or not
   * @returns {boolean} true if the device is Android with HMS, false otherwise
   */
  isHmsDevice: async function () {
    if (this._isHmsDevice === undefined) {
      const resultCode =
        await HMSAvailability.isHuaweiMobileServicesAvailable();
      this._isHmsDevice = resultCode == ErrorCode.HMS_CORE_APK_AVAILABLE;
    }
    return Promise.resolve(this._isHmsDevice);
  },

  /**
   * initialize HMS location kit
   * @returns {Promise} Promise resolves if intialization is successful
   */
  init: async function () {
    if (this.isHmsDevice()) {
      await HmsLocationProvider.init();
    }

    return Promise.resolve(true);
  },

  /**
   * get user's location
   *
   * this function get user's last location on HMS devices, which might be invalid if the user travels
   *
   * In case you need accurate position: use {@link LocationManager.getLocationUpdates} to get
   * accurate real-time location, then after receiving the first location
   * then call {@link LocationManager.stopLocationUpdates} to stop receiving real-time updates
   *
   * @returns {Promise} Promise resolves with user location
   */
  getLocation: function () {
    return new Promise(async (resolve, reject) => {
      if (this.isHmsDevice()) {
        const huaweiLocation = await HmsLocationProvider.getLastLocation();
        console.log("huawei location:", huaweiLocation);
        resolve(transformHuaweiLocation(huaweiLocation));
      } else {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log("google/ios location:", position);
            resolve(position);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          geolocationLocationRequest
        );
      }
    });
  },

  /***** location updates : START */

  /**
   * wrapper around the locationUpdatesCallback, this wrapper is used only when environment is hms
   * it transform the returned result then pass it to actual callback
   *
   * used only when the environment is HMS
   *
   * @param {object} huaweiLocationResult result returned by huawei location kit
   * @returns {nothing}
   */
  locationUpdateCallbackWrapper: function (huaweiLocationResult) {
    // callback(this.transformHuaweiLocation(huaweiLocation));
    /**  @type {import("../..").HuaweiLocation}  */
    const huaweiLocation = huaweiLocationResult.lastLocation;

    if (!locationUpdateCallback) {
      throw Error("Location update calblack is undefined");
    }

    /**  @type {import("react-native-geolocation-service").GeoPosition}  */
    const result = transformHuaweiLocation(huaweiLocation);

    locationUpdateCallback(result);
  },

  /**
   *
   * this variable will hold the watch ID returned by geolocaiton services,
   * used later to stop receiving location updates in {@link LocationManager.stopLocationUpdates}
   *
   * Used only if the environment is IOS or GMS
   *
   * initialized in {@link LocationManager.getLocationUpdates}
   * @type {number}
   */
  _geolocationWatchId: -1,

  /**
   * register a listener to receive real time location updates
   * @param {number} requestCode: an Integer, to indetify this location listener, so you can remove it later
   * @param {function} callback: a function, that will be invoked everytime the app receives new location update
   * @example (locationResult)=> {}
   *
   * @param {function} errorCallback: a function that will be invoked if an error occure scs
   */
  getLocationUpdates: async function (callback, errorCallback) {
    if (await this.isHmsDevice()) {
      locationUpdateCallback = callback;
      HmsLocationProvider.requestLocationUpdates(
        HMS_LOCATION_REQ_CODE,
        this.locationUpdateCallbackWrapper,
        errorCallback
      );
    } else {
      this._geolocationWatchId = Geolocation.watchPosition(
        callback,
        errorCallback,
        geoWatchOptions
      );
    }
  },

  /**
   * remove real time location updates listener
   * @param requestCode: an Integer, used to stop receive location update of previous a request with same requestCode
   * @param callback: a function, that was passed to {@link LocationManager.getLocationUpdates} , that will be removed to stop receiving location updates
   */
  stopLocationUpdates: async function () {
    if (await this.isHmsDevice()) {
      HmsLocationProvider.removeLocationUpdates(
        HMS_LOCATION_REQ_CODE,
        this.locationUpdateCallbackWrapper
      );
    } else {
      Geolocation.clearWatch(this._geolocationWatchId);
    }
  },

  /*** Location updates: END */
};

export default LocationManager;
