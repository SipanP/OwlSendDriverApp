import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";
import * as Location from "expo-location";

const Map = ({ origin, destination }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 51.498733, // This is the Geoloaction of Huxley!
    longitude: -0.179461, // Change to user's current location later on.
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCurrentLocation(location.coords);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });
  }, [origin, destination]);
  return (
    <MapView
      provider={MapView.PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={true}
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      region={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Pickup"
          description={origin.description}
          identifier="origin"
        >
          <Image
            source={require("../assets/location.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Dropoff"
          description={destination.description}
          identifier="destination"
        >
          <Image
            source={require("../assets/destination.png")}
            style={{ height: 25, width: 25 }}
          />
        </Marker>
      )}
      {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
          strokeWidth={2}
          strokeColor={Colors.primary}
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
