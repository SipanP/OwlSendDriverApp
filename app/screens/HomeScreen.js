import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import {
  deleteDoc,
  doc,
  GeoPoint,
  increment,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import "intl";
import "intl/locale-data/jsonp/en";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GoButton from "../components/GoButton";
import Map from "../components/Map";
import NewOrder from "../components/NewOrder";
import StopButton from "../components/StopButton";
import Colors from "../core/Colors";
import { db } from "../core/Config";
import { canTakeParcel, getDistance } from "../core/ParcelFilter.js";

// Number of seconds before driver deletes driver order yet to be confirmed by user in case the user crashed
const TIMEOUT_SECONDS = 300;
let timeoutTimer = null;

// Intervals for uploading live location when delivering or available
const DELIVERING_INTERVAL_SECONDS = 10;
const AVAILABLE_INTERVAL_SECONDS = 60;
let deliveringLocationInterval = null;
let availableLocationInterval = null;

// Indicates whether driver has accepted an order but still waiting for other drivers
let waitingForOtherDrivers = false;

const HomeScreen = ({ navigation, driverProfile }) => {
  const driverOrders = doc(db, "DriverOrders", driverProfile.phone);
  const registeredDrivers = doc(db, "RegisteredDrivers", driverProfile.phone);
  const [online, setOnline] = useState(false);
  const [available, setAvailable] = useState(false);
  const [driverDoc, setDriverDoc] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [moneyModalVisible, setMoneyModalVisible] = useState(false);
  const [sessionEarned, setSessionEarned] = useState(0.0);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 51.498733, // This is the Geoloaction of Huxley!
    longitude: -0.179461, // Change to user's current location later on.
  });
  const [distToPickup, setDistToPickup] = useState(0);
  const [minsToPickup, setMinsToPickup] = useState(0);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrentLocation(location.coords);
  };

  // Disable Android back button to prevent unwanted behaviours
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",

      () => {
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  var formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  });

  const makeAvailable = async () => {
    setAvailable(true);
    await updateDoc(registeredDrivers, {
      available: true,
    });
    // startAvailableLocationBroadcast();
  };

  const makeUnavailable = async () => {
    setAvailable(false);
    await updateDoc(registeredDrivers, {
      available: false,
    });
    // stopAvailableLocationBroadcast();
  };

  const goOnline = async () => {
    setOnline(true);
    await updateDoc(registeredDrivers, {
      online: true,
      sessionEarned: 0.0, // Reset session earned
    });
    makeAvailable();
  };

  const goOffline = async () => {
    setOnline(false);
    await updateDoc(registeredDrivers, {
      online: false,
    });
    makeUnavailable();
  };

  const startDeliveringLocationBroadcast = async () => {
    if (!deliveringLocationInterval) {
      const userOrder = doc(db, "UserOrders", driverDoc.userPhone);

      deliveringLocationInterval = setInterval(async () => {
        await getCurrentLocation();

        if (
          driverDoc.pickup.type === "Pickup" ||
          driverDoc.status === "dropoff"
        ) {
          await updateDoc(userOrder, {
            "driver.location": new GeoPoint(
              currentLocation.latitude,
              currentLocation.longitude
            ),
          });
        }
      }, DELIVERING_INTERVAL_SECONDS * 1000);
    }
  };

  const stopDeliveringLocationBroadcast = () => {
    clearInterval(deliveringLocationInterval);
    deliveringLocationInterval = null;
  };

  const startAvailableLocationBroadcast = async () => {
    if (!availableLocationInterval) {
      availableLocationInterval = 1;
      await getCurrentLocation();
      await updateDoc(registeredDrivers, {
        location: new GeoPoint(
          currentLocation.latitude,
          currentLocation.longitude
        ),
      });

      availableLocationInterval = setInterval(async () => {
        await getCurrentLocation();
        await updateDoc(registeredDrivers, {
          location: new GeoPoint(
            currentLocation.latitude,
            currentLocation.longitude
          ),
        });
      }, AVAILABLE_INTERVAL_SECONDS * 1000);
    }
  };

  const stopAvailableLocationBroadcast = () => {
    clearInterval(availableLocationInterval);
    availableLocationInterval = null;
  };

  useEffect(() => {
    // console.log(driverProfile);

    getCurrentLocation();

    return onSnapshot(driverOrders, (doc) => {
      setDriverDoc(doc.data());
    });
  }, []);

  useEffect(() => {
    return onSnapshot(registeredDrivers, (doc) => {
      setOnline(doc.data().online);
      setAvailable(doc.data().available);
      setSessionEarned(doc.data().sessionEarned);
    });
  }, []);

  useEffect(() => {
    if (driverDoc && online) {
      switch (driverDoc.status) {
        case "pending":
          filterParcel();
          break;
        case "accepted":
          activateModal();
          break;
        case "declined":
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
          hideModal();
          break;
        case "pickup":
        case "dropoff":
          activateModal();
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
          waitingForOtherDrivers = false;

          // Start broadcasting live location to user
          startDeliveringLocationBroadcast();
      }
    } else if (!driverDoc && online) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
      stopDeliveringLocationBroadcast();
      hideModal();

      // If driver already accepted order issue apology
      if (waitingForOtherDrivers) {
        Alert.alert("Sorry, unable to find other drivers to handoff.");
        waitingForOtherDrivers = false;
      }
    } else if (!online) {
      makeUnavailable();
    }
  }, [driverDoc, online]);

  // Filter parcel by dimensions and delivery radius
  const filterParcel = async () => {
    await makeUnavailable();
    await getCurrentLocation();

    if (await canTakeParcel(driverDoc, driverProfile, currentLocation)) {
      const { dist, mins } = await getDistance(
        currentLocation,
        driverDoc.pickup.location,
        driverProfile.vehicle
      );
      setDistToPickup(dist);
      setMinsToPickup(mins);

      activateModal();
    } else {
      // Decline order if not eligible
      await updateDoc(driverOrders, {
        status: "declined",
      });
      await makeAvailable();
    }
  };

  // Activate the modal popup for a new order
  const activateModal = () => {
    makeUnavailable();

    setOrigin({
      location: {
        lat: driverDoc.pickup.location.latitude,
        lng: driverDoc.pickup.location.longitude,
      },
      description: driverDoc.pickup.postcode,
    });
    setDestination({
      location: {
        lat: driverDoc.dropoff.location.latitude,
        lng: driverDoc.dropoff.location.longitude,
      },
      description: driverDoc.dropoff.postcode,
    });

    setShowModal(true);

    Animated.spring(slideAnim, {
      toValue: 0,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();

    if (!timeoutTimer) {
      timeoutTimer = setTimeout(async () => {
        // Delete driver order once timeout
        await deleteDoc(driverOrders);

        // If driver already accepted order issue apology
        if (waitingForOtherDrivers) {
          Alert.alert("Sorry, unable to find other drivers to handoff.");
          waitingForOtherDrivers = false;
        }
      }, TIMEOUT_SECONDS * 1000);
    }
  };

  // slideAnim will be used as the value for position. Initial Value: 100
  const slideAnim = useRef(new Animated.Value(600)).current;
  // This function is called when the driver declines the order
  const hideModal = async () => {
    setShowModal(false);
    // Change driverDoc status to declined.
    if (driverDoc) {
      await updateDoc(driverOrders, {
        status: "declined",
      });
    }
    Animated.spring(slideAnim, {
      toValue: 600,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();
    setOrigin(null);
    setDestination(null);
    makeAvailable();
  };

  // This function is called when the driver accepts the order
  const acceptOrder = async () => {
    waitingForOtherDrivers = true;
    await updateDoc(driverOrders, {
      status: "accepted",
      "pickup.arriveBy": Timestamp.fromMillis(
        Date.now() + minsToPickup * 60 * 1000
      ),
      "dropoff.arriveBy": Timestamp.fromMillis(
        Date.now() + (minsToPickup + driverDoc.minutes) * 60 * 1000
      ),
      name: driverProfile.firstName + " " + driverProfile.lastName,
      vehicle: driverProfile.vehicle,
      location: new GeoPoint(
        currentLocation.latitude,
        currentLocation.longitude
      ),
    });
  };

  const pickedUp = async () => {
    await updateDoc(driverOrders, {
      status: "dropoff",
    });

    // Update user order on firebase to notify user delivering info
    const userOrder = doc(db, "UserOrders", driverDoc.userPhone);
    if (driverDoc.pickup.type === "Pickup") {
      await updateDoc(userOrder, {
        status: "Delivering",
        pickupTime: serverTimestamp(),
      });
    } else if (driverDoc.pickup.type === "Handoff") {
      await updateDoc(userOrder, {
        "driver.name": driverProfile.firstName + " " + driverProfile.lastName,
        "driver.phone": driverProfile.phone,
        "driver.vehicle": driverProfile.vehicle,
        handoffTime: serverTimestamp(),
      });
    }
  };

  const arrived = async () => {
    setMoneyModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 600,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();

    // Stop broadcasting live location to user
    stopDeliveringLocationBroadcast();

    // Update user order on firebase to notify user delivered when type is Deliver
    if (driverDoc.dropoff.type === "Deliver") {
      const userOrder = doc(db, "UserOrders", driverDoc.userPhone);
      await updateDoc(userOrder, {
        status: "Delivered",
        dropoffTime: serverTimestamp(),
      });
    }

    // Increment session earned
    await updateDoc(registeredDrivers, {
      sessionEarned: increment(driverDoc.price),
    });

    setTimeout(async () => {
      setMoneyModalVisible(false);

      // Delete driver order once completed
      await deleteDoc(driverOrders);
      makeAvailable();
    }, 4000);
    setShowModal(false);
    setOrigin(null);
    setDestination(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Map
        style={{ flex: 1 }}
        origin={origin}
        destination={destination}
        currentLocation={currentLocation}
        driverDoc={driverDoc}
      />
      <View style={styles.sessionEarned}>
        <Text style={{ fontWeight: "700" }}>SESSION</Text>
        <Text style={{ fontSize: 26, fontWeight: "700" }}>
          {formatter.format(sessionEarned)}
        </Text>
      </View>
      {!showModal && (
        <View style={styles.settingsIcon}>
          <TouchableOpacity
            onPress={() => navigation.navigate("StartRegister")}
          >
            <FontAwesome name="cog" size={50} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 140,
          alignItems: "center",
        }}
      >
        <View style={{ bottom: 0 }}>
          {!online && !showModal && <GoButton onPress={goOnline} />}
          {online && !showModal && <StopButton onPress={goOffline} />}
        </View>
      </View>

      <Modal
        animationType="fade"
        isVisible={moneyModalVisible}
        onRequestClose={() => {
          setMoneyModalVisible(!moneyModalVisible);
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "white", fontSize: 30, fontWeight: "700" }}>
            You've earned {formatter.format(driverDoc?.price)}!
          </Text>
          <MaterialIcons name="celebration" size={30} color="white" />
        </View>
      </Modal>
      <Animated.View
        style={[
          {
            bottom: 0,
            width: "100%",
            height: "35%",
            transform: [{ translateY: slideAnim }],
            position: "absolute",
          },
          (driverDoc?.status === "pickup" ||
            driverDoc?.status === "dropoff") && { height: "45%" },
        ]}
      >
        <NewOrder
          driverDoc={driverDoc}
          hideModal={hideModal}
          acceptOrder={acceptOrder}
          style={styles.modal}
          pickedUp={pickedUp}
          arrived={arrived}
          distToPickup={distToPickup}
          minsToPickup={minsToPickup}
        />
      </Animated.View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  settingsIcon: {
    position: "absolute",
    top: "8%",
    right: "7%",
  },
  modal: {
    position: "absolute",
    zIndex: 9999,
  },
  sessionEarned: {
    backgroundColor: Colors.primarySeeThrough,
    position: "absolute",
    top: "8%",
    left: "5%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderColor: Colors.darkPrimary,
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
