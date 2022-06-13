import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { db } from "./app/core/Config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import HomeScreen from "./app/screens/HomeScreen";
import RegisterScreen from "./app/screens/RegisterScreen";
import LoginScreen from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "./app/core/Colors";

const globalScreenOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  const Stack = createNativeStackNavigator();
  // const [userDoc, setUserDoc] = useState(null);

  // const Create = () => {
  //   const myDoc = doc(db, "MyCollection", "MyDocument");

  //   const docData = {
  //     name: "John",
  //     bio: "Coder",
  //   };

  //   setDoc(myDoc, docData)
  //     .then(() => {
  //       alert("Document created");
  //     })
  //     .catch((error) => {
  //       alert(error.message);
  //     });
  // };

  // const Read = () => {
  //   const myDoc = doc(db, "MyCollection", "MyDocument");

  //   getDoc(myDoc)
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         setUserDoc(snapshot.data());
  //       } else {
  //         alert("No doc found");
  //       }
  //     })
  //     .catch((error) => {
  //       alert(error.message);
  //     });
  // };

  // const Update = () => {};

  // const Delete = () => {};

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={globalScreenOptions}
          initialRouteName="Login"
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
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
