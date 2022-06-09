import { GeoPosition } from "react-native-geolocation-service";

export interface HuaweiLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  time: number;
  bearing: number;
  fromMockProvider: boolean;
  verticalAccuracyMeters: number;
  speedAccuracyMetersPerSecond: number;
  bearingAccuracyDegrees: number;
}

export interface LocationResult {
  lastLocation: HuaweiLocation;
  locations: HuaweiLocation[];
  lastHWLocaltion?: any;
  hwLocationList?: any[];
}

export type LocationUpdateCallback = (position: Geolocation) => void;
export type ErroCallback = (error: any) => void;

export interface LocationManager {
  _isHmsDevice?: boolean;

  isHmsDevice: () => Promise<Boolean>;

  init: () => Promise<Boolean>;

  locationUpdateCallbackWrapper: (huaweiLocationResult: any) => nothing;

  _geolocationWatchId: number;

  getLocation: () => Promise<GeoPosition>;

  getLocationUpdates: (
    callback: LocationUpdateCallback,
    errorCallback?: ErrorCallback
  ) => void;

  stopLocationUpdates: () => void;

  transformHuaweiLocation: (huaweiLocation: HuaweiLocation) => GeoPosition;
}
