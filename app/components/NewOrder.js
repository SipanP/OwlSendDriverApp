import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";
import { TouchableOpacity } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";

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
  const [accepted, setAccepted] = useState(false);
  const [delivering, setDelivering] = useState(false);
  if (
    driverDoc?.status === "pending" ||
    driverDoc?.status === "accepted" ||
    driverDoc?.status === "declined"
  ) {
    var fullInfo = false;
  } else {
    // pickup, dropoff, arrived
    var fullInfo = true;
  }
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
              setAccepted(false);
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>DECLINE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#238823" }]}
            onPress={() => {
              acceptOrder();
              setAccepted(true);
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
              Arrive by: 09:37
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In 10 mins
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.pickedUpButton]}
            onPress={() => {
              pickedUp();
              setDelivering(true);
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>PICKED UP</Text>
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
              Arrive by: 09:37
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In 100 mins
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.pickedUpButton,
              { backgroundColor: "purple" },
            ]}
            onPress={() => {
              arrived();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>ARRIVED</Text>
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
    backgroundColor: "black",
    width: "90%",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
});
