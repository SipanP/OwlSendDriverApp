import { Formik } from "formik";
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  RadioButton,
} from "react-native";

const RegisterScreen = () => {
  return (
    <View style={styles.registerContainer}>
      <Text>Register</Text>
      <Formik
        initialValues={{ firstName: "", lastName: "", phoneNumber: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <TextInput
              name="firstName"
              placeholder="First"
              style={styles.textInput}
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
              keyboardType="default"
            />
            <TextInput
              name="lastName"
              placeholder="Last"
              style={styles.textInput}
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.firstName}
              keyboardType="default"
            />
            <TextInput
              name="phoneNumber"
              placeholder="Phone Number"
              style={styles.textInput}
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.firstName}
              keyboardType="numeric"
            />
            
            <Button onPress={handleSubmit} title="Submit" />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: "80%",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    width: "100%",
    margin: 10,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
});


export default RegisterScreen;
