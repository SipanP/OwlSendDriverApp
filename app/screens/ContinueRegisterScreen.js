import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Colors from "../core/Colors";
import { Button, Image, Input, Text, ButtonGroup } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const register = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={styles.inputContainter}>
        <Text style={{ color: "grey", marginLeft: 10 }}>
          What type of vehicle will you use for deliveries?
        </Text>
        <ButtonGroup
          buttons={["Bicycle", "Moped", "Car / Van"]}
          selectedIndex={selectedVehicle}
          onPress={(value) => {
            setSelectedVehicle(value);
          }}
          containerStyle={styles.vehicleSelect}
          selectedButtonStyle={{
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
          }}
        />
        <Text style={{ color: "grey", marginLeft: 10 }}>
          In what area are you willing to deliver?
        </Text>
        <Text style={{ color: "grey", marginLeft: 10 }}>
          Maximum package dimension allowed for your vehicle (Optional)
        </Text>
        <View style={{ width: "25%", flexDirection: "row" }}>
          <Input
            placeholder="Length (cm)"
            keyboardType="numeric"
            value={length}
            onChangeText={(text) => setLength(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Width (cm)"
            keyboardType="numeric"
            value={width}
            onChangeText={(text) => setWidth(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={(text) => setHeight(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
            style={styles.sizeField}
          />
        </View>
      </View>
      <Button
        title="Register"
        raised
        onPress={register}
        containerStyle={styles.button}
        buttonStyle={styles.buttonStyle}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainter: {
    width: 400,
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  button: { width: 200, marginTop: 10 },
  vehicleSelect: {
    marginBottom: 20,
  },
  sizeField: {
    fontSize: 14,
  },
});

export default RegisterScreen;
