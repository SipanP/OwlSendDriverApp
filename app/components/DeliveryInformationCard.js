import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";

const DeliveryInformationCard = ({ name, address, type, isOnRoute }) => {
  return (
    <View
      style={[
        styles.container,
        isOnRoute
          ? [styles.onRoute, { borderColor: "white", borderWidth: 1 }]
          : [styles.notOnRoute, { borderColor: "black", borderWidth: 1 }],
        styles.boxWithShadow,
      ]}
    >
      <View style={styles.leftCol}>
        <Text
          h1
          style={[
            styles.allText,
            isOnRoute ? styles.onRoute : styles.notOnRoute,
            styles.type,
          ]}
        >
          {type}
        </Text>
      </View>
      <View style={styles.rightCol}>
        <Text
          style={[
            styles.allText,
            isOnRoute ? styles.onRoute : styles.notOnRoute,
          ]}
        >
          <Text
            h4
            style={[
              styles.allText,
              isOnRoute ? styles.onRoute : styles.notOnRoute,
            ]}
          >
            {name} {"\n"}
          </Text>
          {address}
        </Text>
      </View>
    </View>
  );
};

export default DeliveryInformationCard;

const styles = StyleSheet.create({
  boxWithShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  allText: {
    color: "white",
  },
  onRoute: {
    backgroundColor: "black",
    color: "white",
  },
  notOnRoute: {
    backgroundColor: "white",
    color: "black",
  },
  container: {
    paddingTop: 10,
    width: "90%",
    marginTop: 20,
    height: "30%",
    display: "flex",
    flexDirection: "row",
  },
  type: {
    fontWeight: "500",
    textAlign: "center",
  },
  leftCol: {
    flex: 1.5,
    marginRight: 20,
  },
  rightCol: {
    paddingRight: 30,
    flex: 2,
  },
});
