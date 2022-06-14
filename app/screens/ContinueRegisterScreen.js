import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import {
  Button,
  ButtonGroup,
  CheckBox,
  Input,
  Text,
} from "react-native-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Colors from "../core/Colors";

const ContinueRegisterScreen = ({
  userProfile,
  setUserProfile,
  setEditProfile,
}) => {
  const route = useRoute();
  const { firstName, lastName, tel } = route.params;
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [liveLocation, setLiveLocation] = useState(false);
  const [radius, setRadius] = useState("");

  const register = async () => {
    const profile = {
      firstName: firstName,
      lastName: lastName,
      phone: tel,
      length: length,
      width: width,
      height: height,
      weight: weight,
      selectedVehicle: selectedVehicle,
      liveLocation: liveLocation,
      radius: radius,
    };

    // Save user profile into persistent storage on device.
    try {
      await AsyncStorage.setItem("profile", JSON.stringify({ profile }));
    } catch (e) {
      console.log(e);
    }

    setUserProfile(profile);
    setEditProfile(false);
  };

  return (
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
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "45%" }}>
            <GooglePlacesAutocomplete
              styles={styles.inputStyles}
              // onPress={(data, details = null) => {
              //   setOrigin({
              //     location: details.geometry.location,
              //     shortAddress: details.name,
              //     address: details.formatted_address,
              //     postcode: details.address_components.slice(-1)[0].long_name,
              //   });
              // }}
              enablePoweredByContainer={false}
              fetchDetails={true}
              returnKeyType={"search"}
              placeholder="Centre Address"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={400}
              query={{
                key: "AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY",
                language: "en",
              }}
              // currentLocation={true}
              // currentLocationLabel="Current location"
            />
          </View>
          <CheckBox
            containerStyle={{
              width: "30%",
              backgroundColor: "rgba(106, 90, 205, 0.0)",
              paddingLeft: 10,
              paddingRight: 5,
              marginLeft: 0,
              marginRight: 0,
            }}
            textStyle={{ fontWeight: "500" }}
            checkedColor={Colors.primary}
            title="Live Location"
            checked={liveLocation}
            onPress={() => {
              setLiveLocation(!liveLocation);
            }}
          />
          <Input
            containerStyle={{
              width: "25%",
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
      marginBottom: 20,
    },
  },
});

export default ContinueRegisterScreen;
