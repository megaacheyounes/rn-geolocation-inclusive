import HMSLocation from "@hmscore/react-native-hms-location";

/**
 * this object is passed to HMS fused location provide when requesting location updates
 * LocationRequest object descirption and can be found here:{@link https://developer.huawei.com/consumer/en/doc/development/HMS-Plugin-References-V1/datatypes-0000001057838908-V1#section114821110113515}
 */
const locationRequest = {
  priority:
    HMSLocation.FusedLocation.Native.PriorityConstants.PRIORITY_HIGH_ACCURACY,
  interval: 10000,
  numUpdates: 2147483647,
  fastestInterval: 10000,
  expirationTime: 3372036854775807.0,
  smallestDisplacement: 0.0,
  maxWaitTime: 0,
  needAddress: false,
  language: "",
  countryCode: "",
};

/**
 * uses Huawei location API to get user location
 */
const HmsLocationProvider = {
  /**
   * initialize HMS location kit
   * @returns  promise: resolve if intialization is successful
   */
  init: async function () {
    await HMSLocation.LocationKit.Native.init();
    console.log("initilized Hms location successfully");
    return Promise.resolve(true);
  },

  /**
   * get user's last known location
   * @returns  {Promise} resolves with user location
   */
  getLastLocation: async function () {
    /**  @type {import("../..").LocationResult}  */
    const huaweiLocation =
      await HMSLocation.FusedLocation.Native.getLastLocation();
    return Promise.resolve(huaweiLocation);
  },

  /***** location updates : START */
  /**
   * register a listener to receive real time location updates
   * @param {number} requestCode  Integer, to indetify this location listener, so you can remove it later
   * @param {function} callback   function, that will be invoked everytime the app receives new location update
   *ex: (locationResult)=> {}
   * @param {function} errorCallback: callback to be invoked is something goes wrong
   */
  requestLocationUpdates: async function (
    requestCode,
    callback,
    errorCallback
  ) {
    try {
      await HMSLocation.FusedLocation.Native.requestLocationUpdates(
        requestCode,
        locationRequest
      );
      HMSLocation.FusedLocation.Events.addFusedLocationEventListener(callback);
    } catch (err) {
      errorCallback(err);
    }
  },

  /**
   * remove real time location updates listener
   * @param requestCode    Integer: used to stop receive location update of previous a request with same requestCode
   * @param callback   function: that was passed to {@link HmsLocationProvider.requestLocationUpdates} , that will be removed to stop receiving location updates
   */
  removeLocationUpdates: async function (requestCode, callback) {
    try {
      await HMSLocation.FusedLocation.Native.removeLocationUpdates(requestCode);
      HMSLocation.FusedLocation.Events.removeFusedLocationEventListener(
        callback
      );
    } catch (err) {
      errorCallback(err);
    }
  },
  /***** location updates : END */
};

export default HmsLocationProvider;
