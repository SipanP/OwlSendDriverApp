import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import Map from "../components/Map";
import { setDestination, setOrigin } from "../slices/navSlice";
import NewOrder from "../components/NewOrder";
import { db } from "../core/Config";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useState } from "react";

const HomeScreen = () => {
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
    });
  }, []);
  return (
    <View style={styles.container}>
      <Map style={{ flex: 1 }} />
      <NewOrder pickup={userDoc.pickup} dropoff={userDoc.dropoff} />
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
