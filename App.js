import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Alert,
  Platform,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import LocationManager from "./src/location/LocationManager";
import PermissionManager from "./src/location/PermissionManager";

const GREEN = "#00c853";
const BLUE = "#2962ff";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      /**
       * can be ios , hms or gms
       * ios: if the devices is IOS, ex: iPhone .. duh!
       * hms: if the Device is Android with HMS (Huawei Mobile Services), AKA a Huawei android device
       * gms: if the devices is Android with GMS (Google Mobile Services), ex: Samsung, Oppo, Sony ...
       */
      environment: null,
    };
  }

  /**
   * Detect the environemtn and update the ui, then ask for Permissions requried by
   * the GeolocationServie and Huawei location kit
   * @returns Promise: nothing
   */
  async componentDidMount() {
    if (Platform.OS === "ios") {
      this.setState({
        environment: "ios",
      });
    } else {
      const isHms = await LocationManager.isHmsDevice();
      this.setState({
        environment: isHms ? "hms" : "gms",
      });
    }

    const permissionGranted =
      await PermissionManager.requestLocationPermission();

    if (permissionGranted) {
      console.log("location permission has been granted");
    } else {
      Alert.alert(
        "Permission denied!",
        "You must grant all permissions to use this app!"
      );
    }

    await LocationManager.init();
    console.log("Initialization successful");
    return Promise.resolve();
  }

  render() {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}> Location services demo </Text>
          <Text style={styles.headerSubtitle}>
            A Demo app with location services that works on all mobile devices
            IOS, Android (Google), and Android (Huawei)
          </Text>

          {Platform.OS === "android" && (
            <Text style={styles.headerSubtitle}>
              environment:{" "}
              {this.state.environment === "ios"
                ? "IOS"
                : this.state.environment === "hms"
                ? "Android HMS (Huawei mobile services)"
                : "Android GMS (Google mobile services)"}
            </Text>
          )}
        </View>
      </>
    );
  }
}

class LastLocation extends React.Component {
  constructor() {
    super();
    this.state = { location: {} };
  }

  getLastLocation = () =>
    LocationManager.getLocation()
      .then((location) => {
        this.setState({ location });
      })
      .catch((err) => Alert.alert("error", JSON.stringify(err)));

  render() {
    return (
      <>
        <View style={styles.sectionContainer}>
          <View style={styles.spaceBetweenRow}>
            <Text style={styles.sectionTitle}>Last location:</Text>
          </View>

          <View style={styles.spacing} />

          <Button
            color={BLUE}
            title="Get location"
            onPress={this.getLastLocation}
          />

          <View style={styles.spacing} />

          <View style={styles.spaceBetweenRow}>
            <Text style={styles.monospaced}>
              {JSON.stringify(this.state.location, null, 2)}
            </Text>
          </View>
        </View>
      </>
    );
  }
}

class LocationUpdate extends React.Component {
  constructor() {
    super();
    this.state = {
      locationResult: {},
      autoUpdateEnabled: false,
      buttonColor: BLUE,
    };
  }

  handleLocationUpdate = (locationResult) => {
    console.log(locationResult);
    this.setState({
      locationResult,
    });
  };

  getLocationUpdates = () => {
    LocationManager.getLocationUpdates(this.handleLocationUpdate);
    this.setState({ autoUpdateEnabled: true, buttonColor: GREEN });
  };

  stopLocationUpdates = () => {
    LocationManager.stopLocationUpdates(this.handleLocationUpdate);
    this.setState({ autoUpdateEnabled: false, buttonColor: BLUE });
  };

  render() {
    return (
      <>
        <View style={styles.sectionContainer}>
          <View style={styles.spaceBetweenRow}>
            <Text style={styles.sectionTitle}>
              User real-time location updates:
            </Text>
          </View>

          <View style={styles.spacing} />

          <Button
            color={this.state.buttonColor}
            title={
              this.state.autoUpdateEnabled
                ? "Disable location updates"
                : "Enabled location updates"
            }
            onPress={() => {
              if (this.state.autoUpdateEnabled) {
                this.stopLocationUpdates();
              } else {
                this.getLocationUpdates();
              }
            }}
          />

          <View style={styles.spacing} />

          <View style={styles.spaceBetweenRow}>
            <Text style={styles.monospaced}>
              {JSON.stringify(this.state.locationResult, null, 2)}
            </Text>
          </View>
        </View>
      </>
    );
  }
}

const App = () => {
  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Header />
          <View style={styles.body}>
            <LastLocation />

            <View style={styles.divider} />

            <LocationUpdate />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    height: "100%",
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    elevation: 10,
    margin: 20,
    paddingBottom: 30,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.dark,
  },
  activityData: {
    marginTop: 8,
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
  header: {
    height: 180,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
  },
  spacing: { height: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "black" },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "normal",
    color: "gray",
    marginTop: 10,
  },
  spaceBetweenRow: { flexDirection: "row", justifyContent: "space-between" },
  divider: {
    width: "90%",
    alignSelf: "center",
    height: 1,
    backgroundColor: "grey",
    marginTop: 20,
  },
  boldText: { fontWeight: "bold" },
  centralizeSelf: { alignSelf: "center" },
  centralizeContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 5,
  },
  monospaced: { fontFamily: "monospace" },
});

export default App;
