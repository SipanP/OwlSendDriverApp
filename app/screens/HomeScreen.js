import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import GoButton from "../components/GoButton";
import Map from "../components/Map";
import { db } from "../core/Config";

const HomeScreen = ({ navigation, userProfile, setEditProfile }) => {
  // // Get Location permission
  // const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  //   console.log(text);
  // }

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

  useEffect(() => {
    // console.log(userProfile);

    // Read();
    return onSnapshot(driverOrders, (doc) => {
      setUserDoc(doc.data());
    });
  }, []);

  useEffect(() => {
    if (userDoc) {
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

      if (online && userDoc && userDoc.status === "pending") {
        console.log("New Order Request");
      }
    }
  }, [userDoc]);

  return (
    <View style={styles.container}>
      <Map style={{ flex: 1 }} origin={origin} destination={destination} />
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
          <GoButton onPress={goOnline} />
          {/* <GoButton onPress={() => setEditProfile(true)} /> */}
        </View>
      </View>
      {/* <NewOrder userDoc={userDoc} /> */}
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
});
