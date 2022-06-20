import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StopButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.goText}>GO{"\n"}OFFLINE</Text>
        <FontAwesome
          name="hand-stop-o"
          size={35}
          color="white"
          style={{ alignSelf: "center" }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StopButton;

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 80,
    backgroundColor: "#CC0202",
    borderRadius: 15,
    borderColor: "#8C0101",
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
