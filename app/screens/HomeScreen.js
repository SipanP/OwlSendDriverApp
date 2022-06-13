import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import Map from "../components/Map";
import NewOrder from "../components/NewOrder";
import { db } from "../core/Config";
import { setOrigin, setDestination } from "../slices/navSlice";
import * as Location from "expo-location";
import GoButton from "../components/GoButton";
import { Overlay } from "react-native-elements";

const HomeScreen = () => {
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

  const [online, setOnline] = useState(false);

  const [userDoc, setUserDoc] = useState({
    pickup: {},
    dropoff: {},
  });

  const Create = () => {
    const myDoc = doc(db, "DriverOrders", "MyDocument");

    const docData = {
      name: "John",
      bio: "Coder",
    };

    setDoc(myDoc, docData)
      .then(() => {
        alert("Document created");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const myDoc = doc(db, "DriverOrders", "0987654321");
  const Read = () => {
    getDoc(myDoc)
      .then((snapshot) => {
        if (snapshot.exists) {
          setUserDoc(snapshot.data());
        } else {
          alert("No doc found");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const Update = () => {};

  const Delete = () => {};

  const dispatch = useDispatch();

  useEffect(() => {
    // Read();
    return onSnapshot(myDoc, (doc) => {
      setUserDoc(doc.data());
      dispatch(
        setOrigin({
          location: {
            lat: userDoc.pickup.latitude,
            lng: userDoc.pickup.longitude,
          },
          description: userDoc.pickup.address,
        })
      );
      dispatch(
        setDestination({
          location: {
            lat: userDoc.dropoff.latitude,
            lng: userDoc.dropoff.longitude,
          },
          description: userDoc.dropoff.address,
        })
      );
    });
  }, []);

  dispatch(
    setOrigin({
      location: {
        lat: userDoc.pickup.latitude,
        lng: userDoc.pickup.longitude,
      },
      description: userDoc.pickup.address,
    })
  );
  dispatch(
    setDestination({
      location: {
        lat: userDoc.dropoff.latitude,
        lng: userDoc.dropoff.longitude,
      },
      description: userDoc.dropoff.address,
    })
  );
  return (
    <View style={styles.container}>
      <Map style={{ flex: 1 }} />
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
          <GoButton />
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
