import { useEffect, useRef } from "react";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Colors from "../core/Colors";

const Map = ({ origin, destination, currentLocation, driverDoc }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 300, left: 50 },
    });
  }, [origin, destination]);

  useEffect(() => {
    mapRef.current.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      250
    );
  }, [currentLocation]);

  return (
    <MapView
      provider={MapView.PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={true}
      ref={mapRef}
      style={{ flex: 1 }}
      mapType="mutedStandard"
      initialRegion={{
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
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
            style={{ height: 30, width: 30 }}
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
            style={{ height: 30, width: 30 }}
          />
        </Marker>
      )}
      {origin &&
        destination &&
        (driverDoc?.status === "pending" ||
          driverDoc?.status === "accepted") && (
          <MapViewDirections
            origin={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            destination={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
            strokeWidth={3}
            strokeColor={
              driverDoc.dropoff.type === "Deliver"
                ? Colors.primary
                : Colors.secondary
            }
          />
        )}
      {origin &&
        destination &&
        (driverDoc?.status === "pending" || driverDoc?.status === "pickup") && (
          <MapViewDirections
            origin={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            destination={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
            strokeWidth={3}
            strokeColor={
              driverDoc?.pickup.type === "Pickup"
                ? Colors.dark
                : Colors.secondary
            }
          />
        )}
      {origin && destination && driverDoc?.status === "dropoff" && (
        <MapViewDirections
          origin={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          destination={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          apikey="AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY"
          strokeWidth={3}
          strokeColor={
            driverDoc?.dropoff.type === "Deliver"
              ? Colors.primary
              : Colors.secondary
          }
        />
      )}
    </MapView>
  );
};

export default Map;
