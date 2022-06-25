import "intl";
import "intl/locale-data/jsonp/en";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input } from "react-native-elements";
import Colors from "../core/Colors";
import DeliveryInformationCard from "./DeliveryInformationCard";

let minutesInterval = null;

const getMinutesLeft = (time) => {
  const NANOSECONDS_IN_MINUTE = 60000;
  return Math.max(0, Math.ceil((time - Date.now()) / NANOSECONDS_IN_MINUTE));
};

const formatTime = (time) => {
  return (
    time.toDate().getHours().toString().padStart(2, "0") +
    ":" +
    time.toDate().getMinutes().toString().padStart(2, "0")
  );
};

const NewOrder = ({
  driverDoc,
  hideModal,
  acceptOrder,
  pickedUp,
  arrived,
  distToPickup,
  minsToPickup,
  setVerificationIsFocused,
}) => {
  var formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
  });

  const [minutesLeft, setMinutesLeft] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [invalidCode, setInvalidCode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setVerifying(false);
    setVerificationCode("");
    setInvalidCode(false);

    if (minutesInterval) clearInterval(minutesInterval);

    if (driverDoc?.status === "pickup") {
      setMinutesLeft(getMinutesLeft(driverDoc.pickup.arriveBy.toDate()));
    } else if (driverDoc?.status === "dropoff") {
      setMinutesLeft(getMinutesLeft(driverDoc.dropoff.arriveBy.toDate()));
    }

    minutesInterval = setInterval(() => {
      if (driverDoc?.status === "pickup") {
        setMinutesLeft(getMinutesLeft(driverDoc.pickup.arriveBy.toDate()));
      } else if (driverDoc?.status === "dropoff") {
        setMinutesLeft(getMinutesLeft(driverDoc.dropoff.arriveBy.toDate()));
      }
    }, 1000);

    return () => clearInterval(minutesInterval);
  }, [driverDoc]);

  return (
    <View style={styles.container}>
      <DeliveryInformationCard
        name={driverDoc?.pickup.name}
        type={driverDoc?.pickup.type}
        address={driverDoc?.pickup.address}
        isOnRoute={driverDoc?.status === "pickup"}
        status={driverDoc?.status}
        phone={driverDoc?.pickup.phone}
      />
      <DeliveryInformationCard
        name={driverDoc?.dropoff.name}
        type={driverDoc?.dropoff.type}
        address={driverDoc?.dropoff.address}
        isOnRoute={driverDoc?.status === "dropoff"}
        status={driverDoc?.status}
        phone={driverDoc?.dropoff.phone}
      />
      {(driverDoc?.status === "pending" ||
        driverDoc?.status === "accepted") && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 5,
            paddingHorizontal: 10,
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "30%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
            }}
          >
            {driverDoc?.minutes + minsToPickup} min
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "30%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
              paddingLeft: 5,
            }}
          >
            {Math.round((driverDoc?.distance + distToPickup) * 100) / 100} mi
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: "38%",
              color: "white",
              fontSize: 40,
              textAlign: "right",
              paddingLeft: 10,
            }}
          >
            {formatter.format(driverDoc?.price)}
          </Text>
        </View>
      )}
      {driverDoc?.status === "pending" && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D2222D" }]}
            onPress={() => {
              hideModal();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>DECLINE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#238823" }]}
            onPress={() => {
              acceptOrder();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      )}
      {driverDoc?.status === "accepted" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            marginTop: 15,
          }}
        >
          <ActivityIndicator size="large" color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "600",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.6,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            Waiting for other drivers
          </Text>
        </View>
      )}
      {driverDoc?.status === "pickup" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>
              Arrive by: {formatTime(driverDoc.pickup.arriveBy)}
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In {minutesLeft} mins
            </Text>
          </View>
          {!verifying && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.pickedUpButton,
                {
                  backgroundColor:
                    driverDoc?.pickup.type === "Handoff"
                      ? Colors.secondary
                      : Colors.dark,
                },
              ]}
              onPress={() => {
                if (driverDoc?.pickup.type === "Handoff") {
                  setVerifying(true);
                } else {
                  pickedUp();
                }
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  textTransform: "uppercase",
                  fontWeight: "500",
                }}
              >
                {driverDoc?.pickup.type === "Pickup"
                  ? "Picked Up"
                  : "Handed Off"}
              </Text>
            </TouchableOpacity>
          )}
          {verifying && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "90%",
                padding: 10,
                marginTop: 10,
                backgroundColor: "white",
                borderRadius: 15,
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 30,
                  fontWeight: "500",
                  width: "70%",
                }}
              >
                Verification Code:
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: 30,
                  marginLeft: 10,
                  fontWeight: "700",
                  width: "30%",
                }}
              >
                {driverDoc?.pickup.code}
              </Text>
            </View>
          )}
        </View>
      )}
      {driverDoc?.status === "dropoff" && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 30 }}>
              Arrive by: {formatTime(driverDoc.dropoff.arriveBy)}
            </Text>
            <Text style={{ color: "white", fontSize: 30, paddingLeft: 10 }}>
              In {minutesLeft} mins
            </Text>
          </View>
          {!verifying && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.pickedUpButton,
                {
                  backgroundColor:
                    driverDoc?.dropoff.type === "Handoff"
                      ? Colors.secondary
                      : Colors.dark,
                },
              ]}
              onPress={() => {
                setVerifying(true);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  textTransform: "uppercase",
                  fontWeight: "500",
                }}
              >
                {driverDoc?.dropoff.type === "Deliver"
                  ? "Delivered"
                  : "Handed Off"}
              </Text>
            </TouchableOpacity>
          )}
          {verifying && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <Input
                placeholder="Verification Code"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={(text) => {
                  setVerificationCode(text);
                }}
                containerStyle={{
                  width: "50%",
                  backgroundColor: "white",
                }}
                style={{ fontWeight: "700", textAlign: "center", fontSize: 18 }}
                errorMessage={invalidCode && "Invalid Code"}
                errorStyle={{ textAlign: "center" }}
                onFocus={() => setVerificationIsFocused(true)}
                onBlur={() => setVerificationIsFocused(false)}
                onSubmitEditing={() => setVerificationIsFocused(false)}
              />
              <Button
                title="Enter"
                raised
                onPress={() => {
                  if (verificationCode === driverDoc?.dropoff.code) {
                    arrived();
                    setVerificationIsFocused(false);
                  } else {
                    setInvalidCode(true);
                  }
                }}
                containerStyle={styles.verifyButtonContainer}
                buttonStyle={styles.verifyButtonStyle}
                titleStyle={{ fontWeight: "500" }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default NewOrder;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.primarySeeThrough,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  button: {
    width: "35%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  pickedUpButton: {
    width: "90%",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
  verifyButtonContainer: {
    borderRadius: 6,
    height: 40,
    width: 90,
    marginLeft: 5,
  },

  verifyButtonStyle: {
    backgroundColor: Colors.dark,
    borderRadius: 6,
    height: 40,
  },
});
