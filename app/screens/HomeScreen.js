import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import Map from "../components/Map";
import { setDestination, setOrigin } from "../slices/navSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();
  return (
    <View>
      <View
        style={{
          width: 300,
          height: 450,
        }}
      >
        <Map />
      </View>
      <View
        style={{
          padding: 5,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 200,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shield_of_Imperial_College_London.svg/1200px-Shield_of_Imperial_College_London.svg.png",
          }}
        />
        {/* <Text>test12</Text> */}
        <GooglePlacesAutocomplete
          styles={{
            textInputContainer: {
              backgroundColor: "grey",
            },
            textInput: {
              height: 38,
              color: "#5d5d5d",
              fontSize: 16,
            },
            container: {
              flex: 0,
            },
          }}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          placeholder="Where from?"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          query={{
            key: "AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY",
            language: "en",
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
