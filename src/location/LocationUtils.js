/**
 * utility function to transform result returned by Huawei HMS location Kit to have
 * the same structure as the location object returned geolocation Service package
 *
 * details about Huawei location object can be found here: {@link https://developer.huawei.com/consumer/en/doc/development/HMS-Plugin-References-V1/datatypes-0000001057838908-V1#section2512153819346}
 *
 * @param {object} huaweiLocation location object returned by HMS location kit
 * @returns {import("react-native-geolocation-service").GeoPosition} object with the same structure as the object returned by geolocation service
 */
export const transformHuaweiLocation = (
  /**  @type {import("../..").HuaweiLocation}  */
  huaweiLocation
) => {
  /**  @type {import("react-native-geolocation-service").GeoPosition}  */
  return {
    coords: {
      latitude: huaweiLocation.latitude,
      longitude: huaweiLocation.longitude,
      accuracy: huaweiLocation.accuracy,
      altitude: huaweiLocation.altitude,
      heading: -1,
      speed: huaweiLocation.speed,
      altitudeAccuracy: -1,
    },
    timestamp: huaweiLocation.time,
    mocked: huaweiLocation.fromMockProvider,
    provider: "fused",
    /** other fields in hauwei location object */

    // verticialAccuracyMeters: huaweiLocation.verticalAccuracyMeters,
    // speedAccuracyMetersPerSecond: huaweiLocation.speedAccuracyMetersPerSecond,
    // bearingAccuracyDegrees: huaweiLocation.bearingAccuracyDegrees,
  };
};
