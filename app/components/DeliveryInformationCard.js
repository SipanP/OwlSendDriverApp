import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import call from "react-native-phone-call";
import IonIcon from "react-native-vector-icons/Ionicons";
import Colors from "../core/Colors";

const DeliveryInformationCard = ({
  name,
  address,
  type,
  isOnRoute,
  status,
  phone,
}) => {
  const phoneArgs = {
    number: phone, // String value with the number to call
    prompt: true, // Optional boolean property. Determines if the user should be prompted prior to the call
    skipCanOpen: true, // Skip the canOpenURL check
  };
  if (status === "pending" || status === "accepted" || status === "declined") {
    var fullInfo = false;
  } else {
    // pickup, dropoff, arrived
    var fullInfo = true;
  }
  return (
    <View
      style={[
        styles.container,
        isOnRoute
          ? [styles.onRoute, { borderColor: "white", borderWidth: 1 }]
          : [styles.notOnRoute, { borderColor: "black", borderWidth: 1 }],
        styles.boxWithShadow,
        fullInfo ? { height: "30%" } : {},
      ]}
    >
      <View style={styles.leftCol}>
        <Text
          h1
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.allText,
            isOnRoute ? styles.onRoute : styles.notOnRoute,
            styles.type,
          ]}
        >
          {type}
        </Text>
        {fullInfo && (
          <TouchableOpacity
            style={styles.call}
            onPress={() => {
              call(phoneArgs).catch(console.error);
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
              CALL
            </Text>
            <IonIcon name="call" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.rightCol}>
        <Text
          adjustsFontSizeToFit
          style={[
            styles.allText,
            isOnRoute ? styles.onRoute : styles.notOnRoute,
          ]}
        >
          {fullInfo && (
            <Text
              h4
              style={[
                styles.allText,
                isOnRoute ? styles.onRoute : styles.notOnRoute,
              ]}
            >
              {name} {"\n"}
            </Text>
          )}
          {fullInfo && address}
          {!fullInfo && (
            <Text style={{ fontSize: 20 }}>
              {address?.includes(",")
                ? address?.slice(address?.indexOf(",") + 2, address.length)
                : address}
            </Text>
          )}
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
    height: "20%",
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
  call: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    width: "70%",
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: "5%",
  },
});
