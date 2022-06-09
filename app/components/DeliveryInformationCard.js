import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-elements";

const DeliveryInformationCard = ({ name, address, isPickup }) => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title>{isPickup ? "Pickup:" : "Deliver:"}</Card.Title>
      </Card>
    </View>
  );
};

export default DeliveryInformationCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
