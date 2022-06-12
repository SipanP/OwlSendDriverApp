import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import Map from "../components/Map";
import NewOrder from "../components/NewOrder";
import { db } from "../core/Config";

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
      <NewOrder userDoc={userDoc} />
      {/* pickup={userDoc.pickup} dropoff={userDoc.dropoff} /> */}
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
