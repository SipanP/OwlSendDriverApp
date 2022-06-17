import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";
import { TouchableOpacity } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";

const NewOrder = ({
  userDoc,
  hideModal,
  acceptOrder,
  pickup,
  pickedUp,
  arrived,
}) => {
  var formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  });
  const [accepted, setAccepted] = useState(false);
  const [delivering, setDelivering] = useState(false);
  if (
    userDoc?.status === "pending" ||
    userDoc?.status === "accepted" ||
    userDoc?.status === "declined"
  ) {
    var fullInfo = false;
  } else {
    // pickup, dropoff, arrived
    var fullInfo = true;
  }
  return (
    <View style={styles.container}>
      <DeliveryInformationCard
        name={userDoc?.pickup.name}
        type={userDoc?.pickup.type}
        address={userDoc?.pickup.address}
        isOnRoute={userDoc?.status === "pickup"}
        status={userDoc?.status}
        phone={userDoc?.pickup.phone}
      />
      <DeliveryInformationCard
        name={userDoc?.dropoff.name}
        type={userDoc?.dropoff.type}
        address={userDoc?.dropoff.address}
        isOnRoute={userDoc?.status === "dropoff"}
        status={userDoc?.status}
        phone={userDoc?.dropoff.phone}
      />
      {(userDoc?.status === "pending" || userDoc?.status === "accepted") && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 40 }}>
            {userDoc?.minutes} min
          </Text>
          <Text style={{ color: "white", fontSize: 40 }}>
            {userDoc?.distance} mi
          </Text>
          <Text style={{ color: "white", fontSize: 40 }}>
            {formatter.format(userDoc?.price)}
          </Text>
        </View>
      )}
      {userDoc?.status === "pending" && (
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
      {userDoc?.status === "accepted" && (
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
      {userDoc?.status === "pickup" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
            }}
          >
            <Text style={{ color: "white", fontSize: 25 }}>
              Arrive by: 09:37
            </Text>
            <Text style={{ color: "white", fontSize: 25 }}>In 10 mins</Text>
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
      {userDoc?.status === "dropoff" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
            }}
          >
            <Text style={{ color: "white", fontSize: 25 }}>
              Arrive by: 09:37
            </Text>
            <Text style={{ color: "white", fontSize: 25 }}>In 10 mins</Text>
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
