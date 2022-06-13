import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";

const NewOrder = ({ userDoc }) => {
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
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "45%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.primarySeeThrough,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
