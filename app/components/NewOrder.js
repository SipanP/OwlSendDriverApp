import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";
import { TouchableOpacity } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";

let minutesInterval = null;

const getMinutesLeft = (time) => {
  const NANOSECONDS_IN_MINUTE = 60000;
  return Math.max(0, Math.ceil((time - Date.now()) / NANOSECONDS_IN_MINUTE));
};

const NewOrder = ({
  driverDoc,
  hideModal,
  acceptOrder,
  pickedUp,
  arrived,
  distToPickup,
  minsToPickup,
}) => {
  var formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  });

  const [minutesLeft, setMinutesLeft] = useState("");

  useEffect(() => {
    if (minutesInterval) clearInterval(minutesInterval);

    if (driverDoc?.status === "pickup") {
      setMinutesLeft(getMinutesLeft(driverDoc.pickup.arriveBy.toDate()));
    } else if (driverDoc?.status === "dropoff") {
      setMinutesLeft(getMinutesLeft(driverDoc.dropoff.arriveBy.toDate()));
    }

    minutesInterval = setInterval(() => {
      if (driverDoc?.status === "pickup") {
        setMinutesLeft(getMinutesLeft(driverDoc.pickup.arriveBy.toDate()));
      } else if (driverDoc?.status === "dropoff") {
        setMinutesLeft(getMinutesLeft(driverDoc.dropoff.arriveBy.toDate()));
      }
    }, 1000);

    return () => clearInterval(minutesInterval);
  }, [driverDoc]);

  return (
    <View style={styles.container}>
      <DeliveryInformationCard
        name={driverDoc?.pickup.name}
        type={driverDoc?.pickup.type}
        address={driverDoc?.pickup.address}
        isOnRoute={driverDoc?.status === "pickup"}
        status={driverDoc?.status}
        phone={driverDoc?.pickup.phone}
      />
      <DeliveryInformationCard
        name={driverDoc?.dropoff.name}
        type={driverDoc?.dropoff.type}
        address={driverDoc?.dropoff.address}
        isOnRoute={driverDoc?.status === "dropoff"}
        status={driverDoc?.status}
        phone={driverDoc?.dropoff.phone}
      />
      {(driverDoc?.status === "pending" ||
        driverDoc?.status === "accepted") && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 5,
            paddingHorizontal: 10,
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "30%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
            }}
          >
            {driverDoc?.minutes + minsToPickup} min
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "30%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
              paddingLeft: 5,
            }}
          >
            {driverDoc?.distance + distToPickup} mi
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "38%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
              paddingLeft: 10,
            }}
          >
            {formatter.format(driverDoc?.price)}
          </Text>
        </View>
      )}
      {driverDoc?.status === "pending" && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D2222D" }]}
            onPress={() => {
              hideModal();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>DECLINE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#238823" }]}
            onPress={() => {
              acceptOrder();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      )}
      {driverDoc?.status === "accepted" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            marginTop: 15,
          }}
        >
          <ActivityIndicator size="large" color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "600",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.6,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            Waiting for other drivers
          </Text>
        </View>
      )}
      {driverDoc?.status === "pickup" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>
              Arrive by:{" "}
              {driverDoc.pickup.arriveBy
                .toDate()
                .toLocaleTimeString("en-GB")
                .substring(0, 5)}
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In {minutesLeft} mins
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.pickedUpButton,
              {
                backgroundColor:
                  driverDoc?.pickup.type === "Handoff"
                    ? Colors.secondary
                    : Colors.dark,
              },
            ]}
            onPress={() => {
              pickedUp();
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              {driverDoc?.pickup.type}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {driverDoc?.status === "dropoff" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>
              Arrive by:{" "}
              {driverDoc.dropoff.arriveBy
                .toDate()
                .toLocaleTimeString("en-GB")
                .substring(0, 5)}
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In {minutesLeft} mins
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.pickedUpButton,
              {
                backgroundColor:
                  driverDoc?.dropoff.type === "Handoff"
                    ? Colors.secondary
                    : Colors.dark,
              },
            ]}
            onPress={() => {
              arrived();
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              {driverDoc?.dropoff.type}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.primarySeeThrough,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    width: "35%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  pickedUpButton: {
    width: "90%",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
});
