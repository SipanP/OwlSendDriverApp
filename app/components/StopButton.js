import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StopButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.goText}>STOP</Text>
        <FontAwesome
          name="hand-stop-o"
          size={35}
          color="white"
          style={{ marginTop: 6 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StopButton;

const styles = StyleSheet.create({
  container: {
    width: 165,
    backgroundColor: "#CC0202",
    borderRadius: 15,
    borderColor: "#8C0101",
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
