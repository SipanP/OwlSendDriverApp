import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import GoButton from "../components/GoButton";
import Map from "../components/Map";
import StopButton from "../components/StopButton";
import { db } from "../core/Config";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../core/Colors";
import NewOrder from "../components/NewOrder";

const HomeScreen = ({ navigation, userProfile }) => {
  const driverOrders = doc(db, "DriverOrders", userProfile.phone);
  const registeredDrivers = doc(db, "RegisteredDrivers", userProfile.phone);
  const [online, setOnline] = useState(false);
  const [userDoc, setUserDoc] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const goOnline = async () => {
    setOnline(true);
    await updateDoc(registeredDrivers, {
      online: true,
    });
  };

  const goOffline = async () => {
    setOnline(false);
    await updateDoc(registeredDrivers, {
      online: false,
    });
  };

  useEffect(() => {
    // console.log(userProfile);

    // Read();
    return onSnapshot(driverOrders, (doc) => {
      setUserDoc(doc.data());
    });
  }, []);

  useEffect(() => {
    return onSnapshot(registeredDrivers, (doc) => {
      setOnline(doc.data().online);
    });
  }, []);

  useEffect(() => {
    if (userDoc && online && userDoc.status === "pending") {
      setOrigin({
        location: {
          lat: userDoc.pickup.location.latitude,
          lng: userDoc.pickup.location.longitude,
        },
        description: userDoc.pickup.postcode,
      });
      setDestination({
        location: {
          lat: userDoc.dropoff.location.latitude,
          lng: userDoc.dropoff.location.longitude,
        },
        description: userDoc.dropoff.postcode,
      });

      setShowModal(true);
    }
  }, [userDoc, online]);

  const [showModal, setShowModal] = useState(false);

  const hideModal = async () => {
    setShowModal(false);
    await updateDoc(driverOrders, {
      status: "declined",
    });
  };
  return (
    <View style={styles.container}>
      <Map style={{ flex: 1 }} origin={origin} destination={destination} />
      <View style={styles.settingsIcon}>
        <TouchableOpacity onPress={() => navigation.navigate("StartRegister")}>
          <FontAwesome name="cog" size={50} color={Colors.primary} />
        </TouchableOpacity>
      </View>
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
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <NewOrder userDoc={userDoc} hideModal={hideModal} />
      </Modal>
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
});
