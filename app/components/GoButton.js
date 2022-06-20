import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "../core/Colors";
import IonIcon from "react-native-vector-icons/Ionicons";

const GoButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.goText}>GO{"\n"}ONLINE</Text>
        <IonIcon
          name="rocket-outline"
          size={35}
          color="white"
          style={{ alignSelf: "center" }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default GoButton;

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    borderColor: Colors.darkPrimary,
    borderWidth: 2,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  goText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 10,
    alignSelf: "center",
    textAlign: "center",
  },
});
