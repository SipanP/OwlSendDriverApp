import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import Colors from "./app/core/Colors";
import ContinueRegisterScreen from "./app/screens/ContinueRegisterScreen";
import HomeScreen from "./app/screens/HomeScreen";
import StartRegisterScreen from "./app/screens/StartRegisterScreen";
import { store } from "./store";

const globalScreenOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  const Stack = createNativeStackNavigator();
  const [userProfile, setUserProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);

  const getUserProfile = async () => {
    // Get user profile from device storage.
    // AsyncStorage.clear(); // Uncomment to clear user profile
    try {
      const user = JSON.parse(await AsyncStorage.getItem("profile"));
      if (user) {
        setUserProfile(user.profile);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Home = () => {
    return (
      <HomeScreen userProfile={userProfile} setEditProfile={setEditProfile} />
    );
  };

  const StartRegister = () => {
    return <StartRegisterScreen userProfile={userProfile} />;
  };

  const ContinueRegister = () => {
    return (
      <ContinueRegisterScreen
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        setEditProfile={setEditProfile}
      />
    );
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          {userProfile && !editProfile ? (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
          ) : (
            <>
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
            </>
          )}
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
