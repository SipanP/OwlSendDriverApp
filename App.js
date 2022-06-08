import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "./Core/Config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function App() {
  const [userDoc, setUserDoc] = useState(null);

  const Create = () => {
    const myDoc = doc(db, "MyCollection", "MyDocument");

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

  const Read = () => {
    const myDoc = doc(db, "MyCollection", "MyDocument");

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

  return (
    <View style={styles.container}>
      <Button title="Create New doc" onPress={Create}></Button>
      <Button title="Read Doc" onPress={Read}></Button>
      {userDoc != null && <Text>Bio: {userDoc.bio}</Text>}
      {/* <Text>Hey Brad, Let's build our User Instant Delivery App!</Text>
      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
