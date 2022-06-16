import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { doc, GeoPoint, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from "react-native";
import {
  Button,
  ButtonGroup,
  CheckBox,
  Input,
  Text,
} from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Colors from "../core/Colors";
import { db } from "../core/Config";

const ContinueRegisterScreen = ({ route, userProfile, setUserProfile }) => {
  const { firstName, lastName, tel } = route.params;
  const [length, setLength] = useState(
    userProfile?.length ? userProfile.length.toString() : ""
  );
  const [width, setWidth] = useState(
    userProfile?.width ? userProfile.width.toString() : ""
  );
  const [height, setHeight] = useState(
    userProfile?.height ? userProfile.height.toString() : ""
  );
  const [weight, setWeight] = useState(
    userProfile?.weight ? userProfile.weight.toString() : ""
  );
  const [selectedVehicle, setSelectedVehicle] = useState(
    userProfile ? userProfile.vehicle : 0
  );
  const [liveLocation, setLiveLocation] = useState(
    userProfile ? userProfile.liveLocation : false
  );
  const [radius, setRadius] = useState(
    userProfile?.radius ? userProfile.radius.toString() : ""
  );
  const [centerAddress, setCenterAddress] = useState(
    userProfile?.centerAddress
  );
  const ref = useRef();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",

      () => {
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (userProfile) {
      ref.current?.setAddressText(userProfile.centerAddress.address);
    }
  }, []);

  const register = async () => {
    const profile = {
      firstName: firstName,
      lastName: lastName,
      phone: tel,
      length: parseInt(length),
      width: parseInt(width),
      height: parseInt(height),
      weight: parseFloat(weight),
      vehicle: selectedVehicle,
      liveLocation: liveLocation,
      radius: parseFloat(radius),
      centerAddress: centerAddress,
    };

    // Save user profile into persistent storage on device.
    try {
      await AsyncStorage.setItem("profile", JSON.stringify({ profile }));
    } catch (e) {
      console.log(e);
    }

    // Register driver on Firebase
    registerDriver();

    setUserProfile(profile);
  };

  const registerDriver = async () => {
    const myDoc = doc(db, "RegisteredDrivers", tel);

    const docData = {
      name: firstName + " " + lastName,
      dimensions: {
        length: parseInt(length),
        width: parseInt(width),
        height: parseInt(height),
        weight: parseFloat(weight),
      },
      centerAddress: new GeoPoint(
        centerAddress.location.latitude,
        centerAddress.location.longitude
      ),
      radius: parseFloat(radius),
      useLiveLocation: liveLocation,
      vehicle: selectedVehicle,
      online: false,
      // currentLocation:
    };

    await setDoc(myDoc, docData);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    if (location) {
      const { latitude, longitude } = location.coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let address = `${response[0].name}, ${response[0].street}, ${response[0].city}, ${response[0].postalCode}`;
      ref.current?.setAddressText(address);

      setCenterAddress({
        location: { latitude: latitude, longitude: longitude },
        address: address,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar style="light" />

        <View style={styles.inputContainter}>
          <Text style={{ color: "grey", marginLeft: 10 }}>
            What type of vehicle will you use for deliveries?
          </Text>
          <ButtonGroup
            buttons={["Bicycle", "Moped", "Car / Van"]}
            selectedIndex={selectedVehicle}
            onPress={(value) => {
              setSelectedVehicle(value);
            }}
            containerStyle={styles.vehicleSelect}
            selectedButtonStyle={{
              backgroundColor: Colors.primary,
              borderColor: Colors.primary,
            }}
          />
          <Text style={{ color: "grey", marginLeft: 10 }}>
            In what area are you willing to deliver?
          </Text>

          <View style={{ width: "100%" }}>
            <GooglePlacesAutocomplete
              ref={ref}
              styles={styles.inputStyles}
              enablePoweredByContainer={false}
              onPress={(data, details = null) => {
                setCenterAddress({
                  location: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                  address: data.description,
                });
              }}
              fetchDetails={true}
              returnKeyType={"search"}
              placeholder="Centre Address"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={400}
              query={{
                key: "AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY",
                language: "en",
              }}
            />
            <View style={{ position: "absolute", right: 30, top: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  getCurrentLocation();
                }}
              >
                <FontAwesome
                  name="location-arrow"
                  size={35}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              containerStyle={{
                width: "50%",
                backgroundColor: "rgba(106, 90, 205, 0.0)",
                borderColor: "rgba(106, 90, 205, 0.0)",
                paddingLeft: 10,
                paddingRight: 5,
                marginLeft: 0,
                marginRight: 0,
              }}
              textStyle={{ fontWeight: "500" }}
              checkedColor={Colors.primary}
              title="Show Nearby Orders"
              checked={liveLocation}
              onPress={() => {
                setLiveLocation(!liveLocation);
              }}
            />
            <Input
              containerStyle={{
                width: "50%",
                marginTop: 5,
              }}
              placeholder="Radius (mi)"
              keyboardType="numeric"
              value={radius}
              onChangeText={(text) => setRadius(text)}
              style={styles.sizeField}
            />
          </View>
          <Text style={{ color: "grey", marginLeft: 10 }}>
            Maximum package dimension allowed for your vehicle (Optional)
          </Text>
          <View style={{ width: "25%", flexDirection: "row" }}>
            <Input
              placeholder="Length (cm)"
              keyboardType="numeric"
              value={length}
              onChangeText={(text) => setLength(text)}
              style={styles.sizeField}
            />
            <Input
              placeholder="Width (cm)"
              keyboardType="numeric"
              value={width}
              onChangeText={(text) => setWidth(text)}
              style={styles.sizeField}
            />
            <Input
              placeholder="Height (cm)"
              keyboardType="numeric"
              value={height}
              onChangeText={(text) => setHeight(text)}
              style={styles.sizeField}
            />
            <Input
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={(text) => setWeight(text)}
              style={styles.sizeField}
            />
          </View>
        </View>
        <Button
          title="Register"
          raised
          onPress={register}
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
        />
        <View style={{ height: 100 }} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainter: {
    width: "100%",
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  button: { width: 200, marginTop: 10 },
  vehicleSelect: {
    marginBottom: 20,
  },
  sizeField: {
    fontSize: 12,
  },
  inputStyles: {
    container: {
      flex: 0,
      marginTop: 10,
      marginHorizontal: 10,
    },
    textInput: {
      paddingRight: 60,
    },
  },
});

export default ContinueRegisterScreen;
