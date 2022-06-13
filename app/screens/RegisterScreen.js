import { Formik } from "formik";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const register = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50, fontWeight: "700" }}>
        Create a driver account
      </Text>
      <View style={styles.inputContainter}>
        <View style={{ width: 200, flexDirection: "row" }}>
          <Input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <Input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        <Input
          placeholder="Phone number"
          type="tel"
          value={tel}
          onChangeText={(text) => setTel(text)}
          keyboardType={"phone-pad"}
        />
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
            type="number"
            value={length}
            onChangeText={(text) => setLength(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Width (cm)"
            keyboardType="numeric"
            type="number"
            value={width}
            onChangeText={(text) => setWidth(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Height (cm)"
            keyboardType="numeric"
            type="number"
            value={height}
            onChangeText={(text) => setHeight(text)}
            style={styles.sizeField}
          />
          <Input
            placeholder="Weight (kg)"
            keyboardType="numeric"
            type="number"
            value={weight}
            onChangeText={(text) => setWeight(text)}
            style={styles.sizeField}
          />
        </View>
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={register}
        />
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
