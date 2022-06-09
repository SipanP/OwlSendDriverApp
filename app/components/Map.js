import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import tw from "twrnc";
import { selectOrigin, selectDestination } from "../slices/navSlice";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="mutedStandard"
      region={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
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
          strokeColor="red"
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
