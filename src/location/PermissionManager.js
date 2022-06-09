import { PermissionsAndroid, Platform } from "react-native";

import Geolocation from "react-native-geolocation-service";

/**
 * this class handles permissions (supposedly)
 */
const PermissionManager = {
  /**
   * request location and reading storage permissions on Android, as they're required to by geolocation/Huawei location kit, and request location authorization using Geolocation package on IOS
   * @returns {Promise} Promise that resolves with true if the user grant this app the location permission, false otherwise
   */
  requestLocationPermission: async function () {
    if (Platform.OS === "android") {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      const isGranted =
        userResponse["android.permission.ACCESS_COARSE_LOCATION"] ==
          PermissionsAndroid.RESULTS.GRANTED ||
        userResponse["android.permission.ACCESS_FINE_LOCATION"] ==
          PermissionsAndroid.RESULTS.GRANTED ||
        userResponse["android.permission.READ_EXTERNAL_STORAGE"] ==
          PermissionsAndroid.RESULTS.GRANTED ||
        userResponse["android.permission.WRITE_EXTERNAL_STORAGE"] ==
          PermissionsAndroid.RESULTS.GRANTED;
      return Promise.resolve(isGranted);
    } else {
      //todo: test it
      const status = await Geolocation.requestAuthorization("whenInUse");
      return Promise.resolve(status === "granted");
    }
  },
};

export default PermissionManager;
