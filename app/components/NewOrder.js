import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DeliveryInformationCard from "./DeliveryInformationCard";
import Colors from "../core/Colors";

const NewOrder = () => {
  return (
    <View style={styles.container}>
      <DeliveryInformationCard isPickup={true} />
      <DeliveryInformationCard isPickup={false} />
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
