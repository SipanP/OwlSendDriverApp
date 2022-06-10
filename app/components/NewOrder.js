import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";

const NewOrder = ({ pickup, dropoff }) => {
  return (
    <View style={styles.container}>
      <DeliveryInformationCard
        name={pickup.name}
        type={pickup.type}
        address={pickup.address}
        isOnRoute={true}
      />
      <DeliveryInformationCard
        name={dropoff.name}
        type={dropoff.type}
        address={dropoff.address}
        isOnRoute={false}
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
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
