import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";
import { TouchableOpacity } from "react-native";

const NewOrder = ({ userDoc, hideModal }) => {
  var formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  });

  return (
    <View style={styles.container}>
      <DeliveryInformationCard
        name={userDoc?.pickup.name}
        type={userDoc?.pickup.type}
        address={userDoc?.pickup.address}
        isOnRoute={userDoc?.status === "pickup"}
      />
      <DeliveryInformationCard
        name={userDoc?.dropoff.name}
        type={userDoc?.dropoff.type}
        address={userDoc?.dropoff.address}
        isOnRoute={userDoc?.status === "dropoff"}
      />
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
        >
          <Text style={{ color: "white", fontSize: 20 }}>ACCEPT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "35%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.primarySeeThrough,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    width: "35%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
