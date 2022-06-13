import { KeyboardAvoidingView, StyleSheet, View, Platform } from "react-native";
import { Button, Image, Input, Text } from "react-native-elements";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../core/Colors";

const StartRegisterScreen = ({ navigation }) => {
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const continueRegistration = () => {
    console.log("login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      style={styles.container}
    >
      <Image
        source={require("../assets/owl-send-logo-transparent-bg.png")}
        style={{ width: 419, height: 190 }}
      />
      <Text h4 style={{ marginTop: 20, marginBottom: 10, fontWeight: "700" }}>
        Create a driver account
      </Text>
      <View style={styles.inputContainer}>
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
          onSubmitEditing={continueRegistration}
        />
      </View>
      <Button
        buttonStyle={styles.buttonStyle}
        title="Continue"
        containerStyle={styles.button}
        onPress={() => navigation.navigate("ContinueRegister")}
      />
    </KeyboardAvoidingView>
  );
};

export default StartRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 400,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  buttonStyle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
