import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { Button, Image, Input } from "react-native-elements";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../core/Colors";

const LoginScreen = ({ navigation }) => {
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
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
      <View style={styles.inputContainer}>
        <Input
          placeholder="Phone number"
          type="tel"
          autoFocus
          value={tel}
          onChangeText={(text) => setTel(text)}
          keyboardType={"phone-pad"}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button
        buttonStyle={styles.buttonStyle}
        title="Login"
        containerStyle={styles.button}
        onPress={signIn}
      />
      <Button
        title="Register"
        titleStyle={{ color: Colors.primary }}
        containerStyle={styles.button}
        type="outline"
        onPress={() => navigation.navigate("Register")}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  inputContainer: {
    width: 300,
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
