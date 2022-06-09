import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Image
          style={{
            width: 100,
            height: 200,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shield_of_Imperial_College_London.svg/1200px-Shield_of_Imperial_College_London.svg.png",
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
