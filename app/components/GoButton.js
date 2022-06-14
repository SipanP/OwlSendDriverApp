import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "../core/Colors";
import IonIcon from "react-native-vector-icons/Ionicons";

const GoButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.goText}>GO</Text>
        <IonIcon
          name="rocket-outline"
          size={35}
          color="white"
          style={{ marginTop: 6 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default GoButton;

const styles = StyleSheet.create({
  container: {
    width: 125,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    borderColor: Colors.darkPrimary,
    borderWidth: 2,
    paddingLeft: 10,
    flexDirection: "row",
  },
  goText: {
    color: "white",
    fontWeight: "700",
    fontSize: 40,
    marginRight: 5,
  },
});
