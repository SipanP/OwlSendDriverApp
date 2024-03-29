import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import Colors from "../core/Colors";

const StartRegisterScreen = ({ navigation, driverProfile }) => {
  const [tel, setTel] = useState(driverProfile?.phone);
  const [firstName, setFirstName] = useState(driverProfile?.firstName);
  const [lastName, setLastName] = useState(driverProfile?.lastName);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",

      () => {
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (driverProfile) {
      navigation.navigate("Home");
    }
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        style={styles.container}
      >
        <Image
          source={require("../assets/owl-send-logo-transparent-bg.png")}
          style={{
            width: "100%",
            height: 170,
            resizeMode: "contain",
          }}
        />
        <Text h4 style={{ marginTop: 0, marginBottom: 10, fontWeight: "700" }}>
          Create a driver account
        </Text>
        <View style={styles.inputContainer}>
          <View style={{ flexDirection: "row" }}>
            <Input
              containerStyle={{ width: "50%" }}
              placeholder="First Name"
              type="text"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <Input
              containerStyle={{ width: "50%" }}
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
        </View>
        <Button
          buttonStyle={styles.buttonStyle}
          title="Continue"
          containerStyle={styles.button}
          onPress={() =>
            navigation.navigate("ContinueRegister", {
              firstName: firstName,
              lastName: lastName,
              tel: tel,
            })
          }
          disabled={!firstName || !lastName || !tel}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    width: "100%",
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
