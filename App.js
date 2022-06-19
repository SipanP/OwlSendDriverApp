import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Colors from "./app/core/Colors";
import ContinueRegisterScreen from "./app/screens/ContinueRegisterScreen";
import HomeScreen from "./app/screens/HomeScreen";
import StartRegisterScreen from "./app/screens/StartRegisterScreen";

const globalScreenOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  const Stack = createNativeStackNavigator();
  const [driverProfile, setDriverProfile] = useState(null);

  const getDriverProfile = async () => {
    // Get user profile from device storage.
    // AsyncStorage.clear(); // Uncomment to clear user profile
    try {
      const user = JSON.parse(await AsyncStorage.getItem("profile"));
      if (user) {
        setDriverProfile(user.profile);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Home = ({ navigation, route }) => {
    return (
      <HomeScreen
        navigation={navigation}
        route={route}
        driverProfile={driverProfile}
      />
    );
  };

  const StartRegister = ({ navigation, route }) => {
    return (
      <StartRegisterScreen
        navigation={navigation}
        route={route}
        driverProfile={driverProfile}
      />
    );
  };

  const ContinueRegister = ({ navigation, route }) => {
    return (
      <ContinueRegisterScreen
        navigation={navigation}
        route={route}
        driverProfile={driverProfile}
        setDriverProfile={setDriverProfile}
      />
    );
  };

  useEffect(() => {
    getDriverProfile();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={globalScreenOptions}
        initialRouteName="StartRegister"
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="StartRegister"
          component={StartRegister}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContinueRegister"
          component={ContinueRegister}
          options={{ headerTitle: "Enter driver details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
